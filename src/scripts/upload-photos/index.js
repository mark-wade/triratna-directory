// node --env-file=.env index.js

import fs from 'fs';
import { createHash } from 'node:crypto';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-west-2" });
const photos = await getAllPhotoFilenamesFromS3();

const files = await fs.promises.readdir(process.env.PHOTOS_DIR);
for( const file of files ) {
  const omName = file.replace(/\.jpg$/, '');
  const saltedHash = createHash('sha256')
    .update(omName + process.env.SALT)
    .digest('hex');
  const filename = saltedHash + '.jpg';

  console.log(`${file} is hashed as ${filename}`);

  const fileMd5 = await getFileMd5(process.env.PHOTOS_DIR + "/" + file);

  if (photos[filename] && photos[filename] === fileMd5) {
    console.log(`${filename} already exists in S3 and contents match, skipping`);
  } else {
    console.log(`Uploading ${filename}...`);
    await s3.send(new PutObjectCommand({
      Bucket: process.env.PHOTOS_S3_BUCKET,
      Key: filename,
      Body: fs.createReadStream(process.env.PHOTOS_DIR + "/" + file),
    }));
  }
}

async function getAllPhotoFilenamesFromS3() {
  let photos = {};

  let listObjectsCommand = new ListObjectsV2Command({
    Bucket: process.env.PHOTOS_S3_BUCKET,
  });
  let isTruncated = false;

  do {
    const listObjectsResponse = await s3.send(listObjectsCommand);
    for (const item of listObjectsResponse.Contents) {
      photos[item.Key] = item.ETag.replace(/"/g, '');
    }
    isTruncated = listObjectsResponse.IsTruncated;
    listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.PHOTOS_S3_BUCKET,
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