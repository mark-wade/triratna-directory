import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { LambdaClient, GetFunctionConfigurationCommand } from "@aws-sdk/client-lambda";

// Runs the lambdas in src/lambdas behind a local server that behaves like the API Gateway in
// front of them, so the frontend can be pointed at it with API_URL=http://localhost:3001

const PORT = parseInt(process.env.PORT ?? "3001");
const LIVE_API_URL = "https://api.triratna.directory";
const LAMBDAS_DIR = new URL("../../lambdas/", import.meta.url);

// Function names are the ones the lambdas are deployed as (see .github/workflows/deploy-lambda.yaml)
const AUTHORIZER = { dir: "auth", functionName: "Auth" };
const ROUTES = {
  "GET /data": { dir: "data", functionName: "OrderDirectory", authorized: true },
  "POST /feedback": { dir: "feedback", functionName: "Feedback", authorized: true },
  "POST /update-contact-details": { dir: "update-contact-details", functionName: "UpdateContactDetails", authorized: true },
  "POST /acs": { dir: "acs", functionName: "ACS", base64Body: true },
  "GET /logout": { dir: "logout", functionName: "Logout" },
  // Runs on a schedule in production, so this route only exists locally to trigger it by hand
  "POST /refresh-data": { dir: "refresh-data", functionName: "RefreshData" },
};

// Anything set in the shell wins over the deployed configuration, so that for example
// DATA_S3_BUCKET can be pointed somewhere other than production
const shellEnv = { ...process.env };
const functionEnvs = await loadFunctionEnvs([AUTHORIZER, ...Object.values(ROUTES)]);

// Each lambda runs with its own environment variables swapped into process.env, so requests have
// to be handled one at a time
let queue = Promise.resolve();

http.createServer((req, res) => {
  queue = queue.then(() => handleRequest(req, res)).catch((error) => {
    console.error(error);
    if (!res.headersSent) {
      send(res, 500, {}, "Local API error");
    }
  });
}).listen(PORT, () => {
  console.log(`Local API running at http://localhost:${PORT}`);
});

async function handleRequest(req, res) {
  const start = Date.now();
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const body = await readBody(req);

  if (req.method === "OPTIONS") {
    send(res, 204, {}, "");
  } else if (ROUTES[`${req.method} ${url.pathname}`]) {
    await runRoute(ROUTES[`${req.method} ${url.pathname}`], req, url, body, res);
  } else {
    await proxyToLiveApi(req, url, body, res);
  }

  console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - start}ms`);
}

async function runRoute(route, req, url, body, res) {
  const event = {
    version: "2.0",
    rawPath: url.pathname,
    rawQueryString: url.search.replace(/^\?/, ""),
    queryStringParameters: url.search ? Object.fromEntries(url.searchParams) : undefined,
    headers: Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key.toLowerCase(), value])),
    requestContext: {
      http: { method: req.method, path: url.pathname },
    },
    body: route.base64Body ? body.toString("base64") : body.toString(),
    isBase64Encoded: !!route.base64Body,
  };

  if (route.authorized) {
    const authResult = await invoke(AUTHORIZER, event);
    if (!authResult?.isAuthorized) {
      send(res, 403, { "Content-Type": "application/json" }, JSON.stringify({ message: "Forbidden" }));
      return;
    }
    event.requestContext.authorizer = { lambda: authResult.context };
  }

  const result = await invoke(route, event);

  // As with API Gateway, anything that isn't a full response object is treated as the body
  if (result && typeof result === "object" && "statusCode" in result) {
    send(res, result.statusCode, result.headers ?? {}, result.body ?? "");
  } else {
    send(res, 200, {}, result === undefined ? "" : typeof result === "string" ? result : JSON.stringify(result));
  }
}

async function invoke({ dir, functionName }, event) {
  for (const key of Object.keys(process.env)) {
    if (!(key in shellEnv)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, functionEnvs[functionName] ?? {}, shellEnv);

  // Importing a fresh copy each time means edits to the lambda take effect without a restart
  const { handler } = await import(new URL(`${dir}/index.mjs`, LAMBDAS_DIR).href + "?t=" + Date.now());
  return await handler(event);
}

// Routes that have no lambda in this repo (such as /map) still need to work for the app to be usable
async function proxyToLiveApi(req, url, body, res) {
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.origin;
  delete headers.referer;

  const response = await fetch(LIVE_API_URL + url.pathname + url.search, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : body,
    redirect: "manual",
  });

  const responseHeaders = {};
  for (const name of ["content-type", "location", "set-cookie"]) {
    if (response.headers.has(name)) {
      responseHeaders[name] = response.headers.get(name);
    }
  }
  send(res, response.status, responseHeaders, Buffer.from(await response.arrayBuffer()));
}

async function loadFunctionEnvs(functions) {
  const lambda = new LambdaClient({ region: "eu-west-2" });
  const envs = {};
  for (const { functionName } of functions) {
    try {
      const config = await lambda.send(new GetFunctionConfigurationCommand({ FunctionName: functionName }));
      envs[functionName] = config.Environment?.Variables ?? {};
      console.log(`Loaded environment for ${functionName} (${Object.keys(envs[functionName]).length} variables)`);
    } catch (error) {
      console.warn(`Could not load environment for ${functionName}: ${error.message}. Try aws login`);
    }
  }
  return envs;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// The frontend may be running on any local port
function send(res, statusCode, headers, body) {
  const origin = res.req.headers.origin;
  res.writeHead(statusCode, {
    ...headers,
    "Access-Control-Allow-Origin": origin && /^http:\/\/localhost(:\d+)?$/.test(origin) ? origin : "http://localhost:1234",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(body);
}
