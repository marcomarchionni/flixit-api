const { S3Client } = require('@aws-sdk/client-s3');

exports.s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
});

exports.s3BaseParams = {
  Bucket: process.env.BUCKET_NAME,
};
