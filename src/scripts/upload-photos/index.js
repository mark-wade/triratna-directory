import fs from 'fs';
import { createHash } from 'node:crypto';
import { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const s3 = new S3Client({ region: "eu-west-2" });
let hashesOnS3;
try {
 hashesOnS3 = await getMd5HashesOfAllPhotosOnS3();
} catch (error) {
  console.error("Error connecting to AWS. Try aws login");
  process.exit(1);
}

const photoFilenames = await readJsonFromS3("photos.json");

const files = await fs.promises.readdir(process.argv[2]);
for( const file of files ) {
  if (file.endsWith(".jpg")) {
    const omName = file.replace(/\.jpg$/, '');

    const fileMd5 = await getFileMd5(process.argv[2] + "/" + file);

    if (!photoFilenames[omName] || !hashesOnS3[photoFilenames[omName]] || hashesOnS3[photoFilenames[omName]] !== fileMd5) {
      console.log(`Uploading ${file}`);

      photoFilenames[omName] = crypto.randomUUID() + ".jpg";

      await s3.send(new PutObjectCommand({
        Bucket: "triratna-directory-order-photos",
        Key: photoFilenames[omName],
        Body: fs.createReadStream(process.argv[2] + "/" + file),
      }));
    }    
  }
}

writeJsonToS3("photos.json", photoFilenames);

const lambda = new LambdaClient({ region: "eu-west-2" });
await lambda.send(new InvokeCommand({
  FunctionName: "RefreshData",
  InvocationType: "Event",
  Payload: JSON.stringify({}),
}));

async function getMd5HashesOfAllPhotosOnS3() {
  let photos = {};

  let listObjectsCommand = new ListObjectsV2Command({
    Bucket: "triratna-directory-order-photos",
  });
  let isTruncated = false;

  do {
    const listObjectsResponse = await s3.send(listObjectsCommand);
    for (const item of listObjectsResponse.Contents) {
      photos[item.Key] = item.ETag.replace(/"/g, '');
    }
    isTruncated = listObjectsResponse.IsTruncated;
    listObjectsCommand = new ListObjectsV2Command({
      Bucket: "triratna-directory-order-photos",
      ContinuationToken: listObjectsResponse.NextContinuationToken,
    });
  } while (isTruncated);

  return photos;
}

async function getFileMd5(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5');
    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
  });
}

async function readJsonFromS3(key) {
  const response = await s3.send(new GetObjectCommand({
    Bucket: 'triratna-directory-data',
    Key: key,
  }));
  const str = await response.Body.transformToString();
  return JSON.parse(str);
}

async function writeJsonToS3(key, data) {
  await s3.send(new PutObjectCommand({
    Bucket: 'triratna-directory-data',
    Key: key,
    Body: JSON.stringify(data),
  }));
}