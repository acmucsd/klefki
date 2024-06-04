const aws = require('aws-sdk');
const path = require('path');

const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
  });

export async function upload(file: File, fileName: string) {
  const params = {
    ACL: 'public-read',
    Body: file.type,
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${fileName}${path.extname(file.name)}`,
  }
  console.log("uploading...") 
  const data = await s3.upload(params).promise();
  console.log(data);
  console.log(data.Location);
  return data.Location;
}