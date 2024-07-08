import { S3Client } from "@aws-sdk/client-s3";
const path = require('path');
const { Upload } = require("@aws-sdk/lib-storage");

const client = new S3Client({
  apiVersion: '2006-03-01',
  region: process.env.S3_REGION,
  credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  },
});

export async function upload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${file.name}${path.extname(file.name)}`,
  }
  console.log("uploading...") 
  // const response = await client.send(new PutObjectCommand(params));
  const response = await new Upload({
    client,
    params,
  }).done();

  // console.log(response);
  // console.log(response.Location); 
  return response.Location;
}