import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from 'fs/promises';
import { createHash } from 'node:crypto';

const locationsJSON = JSON.parse(
  await readFile(
    new URL('./locations.json', import.meta.url)
  )
);

const s3 = new S3Client({ region: "eu-west-2" });

export const handler = async (event) => {
  const raw = await getDataFromMaitrijala();
  const data = {
    orderMembers: {},
    locations: locationsJSON
  };
  const photos = await getAllPhotoFilenamesFromS3();

  for (const om of raw.data) {
    // Get photo
    const photoFilename = getPhotoFilenameForOrderMember(om.name);
    if (photos.includes(photoFilename)) {
      om.image = photoFilename;
    } else {
      om.image = null;
    }
    
    // Dealias locations
    om.events = om.events.map(event => {
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
    data.orderMembers[om.id] = om;

    // Add any missing locations
    for (const event of om.events) {
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

  await s3.send(new PutObjectCommand({
    Bucket: process.env.DATA_S3_BUCKET,
    Key: "data.json",
    Body: JSON.stringify(data),
  }));
  
  return;
};

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

async function getAllPhotoFilenamesFromS3() {
  let photos = [];

  let listObjectsCommand = new ListObjectsV2Command({
    Bucket: process.env.PHOTOS_S3_BUCKET,
  });
  let isTruncated = false;

  do {
    const listObjectsResponse = await s3.send(listObjectsCommand);
    for (const item of listObjectsResponse.Contents) {
      photos.push(item.Key);
    }
    isTruncated = listObjectsResponse.IsTruncated;
    listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.PHOTOS_S3_BUCKET,
      ContinuationToken: listObjectsResponse.NextContinuationToken,
    });
  } while (isTruncated);

  return photos;
}

function getPhotoFilenameForOrderMember(name) {
  const normalisedName = name.replace(/^./, name[0].toUpperCase());

  return createHash('sha256')
      .update(normalisedName + process.env.PHOTO_SALT)
      .digest('hex') + ".jpg";
}