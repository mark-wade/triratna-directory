import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import jwt from 'jsonwebtoken';

const s3 = new S3Client({ region: "eu-west-2" });

const EMAIL_FIELDS = ["personalEmail", "workEmail"];
const PHONE_FIELDS = ["mobilePhone", "homePhone", "workPhone"];
const ADDRESS_STRING_FIELDS = ["city", "state", "postcode", "country"];

class ValidationError extends Error {}

export const handler = async (event) => {
  try {
    const email = getAuthenticatedEmail(event);
    if (!email) {
      return response(401, "Not signed in");
    }

    let contactDetails;
    try {
      contactDetails = buildContactDetails(JSON.parse(event.body));
    } catch (error) {
      if (error instanceof ValidationError || error instanceof SyntaxError) {
        return response(400, error.message);
      }
      throw error;
    }

    const dbId = await getDbIdForEmail(email);
    if (!dbId) {
      return response(403, "No Order member record was found for the signed in user");
    }

    const apiResponse = await updateOrderMember(dbId, contactDetails);
    if (!apiResponse.ok) {
      console.log(`Order office API responded ${apiResponse.status}: ${await apiResponse.text()}`);
      return response(502, "The contact details could not be updated");
    }

    return {
      statusCode: 200,
      headers: {},
      body: '',
    };
  }
  catch (error) {
    console.log(error);

    return response(500, "The contact details could not be updated");
  }
};

// The token has already been verified by the Auth lambda that authorises this route, so we
// only need to read the email address (the SSO name ID) back out of it
function getAuthenticatedEmail(event) {
  const authorization = event.headers?.authorization;
  if (!authorization) {
    return null;
  }
  return jwt.decode(authorization.replace(/^Bearer /, ''))?.sub ?? null;
}

// Picks out the contact details we allow to be updated, in the shape the order office API
// expects them, rejecting anything that isn't valid
function buildContactDetails(body) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Invalid request body");
  }

  rejectUnknownFields(body, [...EMAIL_FIELDS, ...PHONE_FIELDS, "address"]);

  const contactDetails = {};

  for (const field of EMAIL_FIELDS) {
    if (!(field in body)) {
      continue;
    }
    const email = stringOrNull(body[field], field);
    if (email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError(`${field} is not a valid email address`);
    }
    contactDetails[field] = email;
  }

  for (const field of PHONE_FIELDS) {
    if (field in body) {
      contactDetails[field] = stringOrNull(body[field], field);
    }
  }

  if ("address" in body) {
    contactDetails.address = buildAddress(body.address);
  }

  if (Object.keys(contactDetails).length === 0) {
    throw new ValidationError("No contact details provided");
  }

  return contactDetails;
}

function buildAddress(address) {
  if (address === null || address === undefined) {
    return null;
  }
  if (typeof address !== "object" || Array.isArray(address)) {
    throw new ValidationError("address must be an object");
  }

  rejectUnknownFields(address, [...ADDRESS_STRING_FIELDS, "addressLines"]);

  const result = {};

  for (const field of ADDRESS_STRING_FIELDS) {
    if (field in address) {
      result[field] = stringOrNull(address[field], field);
    }
  }

  if ("addressLines" in address) {
    const addressLines = address.addressLines;
    if (addressLines === null || addressLines === undefined) {
      result.addressLines = null;
    } else if (!Array.isArray(addressLines) || addressLines.some((line) => typeof line !== "string")) {
      throw new ValidationError("addressLines must be an array of strings");
    } else {
      result.addressLines = addressLines.map((line) => line.trim());
    }
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError("No address details provided");
  }

  return result;
}

function rejectUnknownFields(object, allowedFields) {
  const unknownFields = Object.keys(object).filter((field) => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    throw new ValidationError(`Unexpected field(s): ${unknownFields.join(", ")}`);
  }
}

// A blank value means the user wants to remove that detail
function stringOrNull(value, field) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be text`);
  }
  return value.trim() === "" ? null : value.trim();
}

// The signed in user is the Order member whose contact details include the email address they
// signed in with, which is the same way the frontend decides whose profile someone can edit
async function getDbIdForEmail(email) {
  const s3Response = await s3.send(new GetObjectCommand({
    Bucket: process.env.DATA_S3_BUCKET,
    Key: "data.json",
  }));
  const data = JSON.parse(await s3Response.Body.transformToString());

  const orderMember = Object.values(data.orderMembers).find((om) =>
    [om.contact?.personalEmail, om.contact?.workEmail].some(
      (contactEmail) => contactEmail && contactEmail.toLowerCase() === email.toLowerCase()
    )
  );

  return orderMember?.dbId ?? null;
}

async function updateOrderMember(dbId, contactDetails) {
  const tokenResponse = await fetch(process.env.ORDER_OFFICE_API_URL + "/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: process.env.ORDER_OFFICE_API_USERNAME,
      password: process.env.ORDER_OFFICE_API_PASSWORD,
    }),
  });
  const token = await tokenResponse.json();

  return await fetch(process.env.ORDER_OFFICE_API_URL + "/order-members/" + encodeURIComponent(dbId), {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactDetails),
  });
}

function response(statusCode, message) {
  return {
    statusCode,
    headers: {},
    body: JSON.stringify({ message }),
  };
}
