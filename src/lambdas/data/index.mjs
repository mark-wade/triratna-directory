import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-west-2" });

export const handler = async (event) => {
  const response = await s3.send(new GetObjectCommand({
    Bucket: process.env.DATA_S3_BUCKET,
    Key: "data.json",
  }));

  const str = await response.Body.transformToString();
  
  return {
    statusCode: 200,
    body: str
  }
};