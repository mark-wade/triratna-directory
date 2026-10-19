import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-west-2" });

export const handler = async (event) => {
  const augmentations = await readJsonFromS3("augmentations.json");

  const raw = await getDataFromMaitrijala();
  const data = {
    orderMembers: augmentations,
    locations: await readJsonFromS3("locations.json")
  };

  const omPhotos = await readJsonFromS3("photos.json");
  
  for (const om of raw.data) {
    if (om.name === "NameWithheld") {
      continue;
    }
    
    // Get photo
    om.image = omPhotos[om.id] ?? null;
    
    // Dealias locations
    om.events = om.events.map(event => {
      if (event.privatePreceptor === "NameWithheld") {
        event.privatePreceptor = null;
      }
      if (event.publicPreceptor === "NameWithheld") {
        event.publicPreceptor = null;
      }
      if (event.location) {
        if (event.location === "null") {
          event.location = null;
        } else {
          for (const [locKey, locValue] of Object.entries(data.locations)) {
            if (locValue.aliases && locValue.aliases.includes(event.location)) {
              event.location = locKey;
              return event;
            }
          }
        }
      }
      return event;
    });
    const orderMember = {
      ...om,
      ...augmentations[om.id] ?? {}
    };

    data.orderMembers[om.id] = om.orderDirectoryConsent === false
      ? redactOrderMember(orderMember)
      : orderMember;

    // Add any missing locations
    for (const event of data.orderMembers[om.id].events) {
      if (
        event.type === "ordained" &&
        event.location &&
        !data.locations.hasOwnProperty(event.location)
      ) {
        data.locations[event.location] = {
          name: event.location,
          type: "unknown"
        };
      }
    }
  }

  await writeJsonToS3("data.json", data);

  return;
};

export function redactOrderMember(orderMember) {
  return {
    name: orderMember.name,
    orderDirectoryConsent: false,
    gender: null,
    area: null,
    status: orderMember.status,
    image: null,
    events: orderMember.events
      .filter((event) => ["ordained", "died", "resigned", "removed"].includes(event.type))
      .map((event) => ({
        type: event.type,
        date: event.date ? event.date.slice(0, 4) + "-01-01" : undefined,
        ...(event.type === "ordained" ? {
          privatePreceptor: event.privatePreceptor,
          publicPreceptor: event.publicPreceptor,
          location: null,
        } : {}),
      })),
  };
}

async function getDataFromMaitrijala() {
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

  const dataResponse = await fetch(process.env.ORDER_OFFICE_API_URL + "/order-members", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token.token,
    },
  });
  return await dataResponse.json();
}

async function readJsonFromS3(key) {
  const response = await s3.send(new GetObjectCommand({
    Bucket: process.env.DATA_S3_BUCKET,
    Key: key,
  }));
  const str = await response.Body.transformToString();
  return JSON.parse(str);
}

async function writeJsonToS3(key, data) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.DATA_S3_BUCKET,
    Key: key,
    Body: JSON.stringify(data),
  }));
}