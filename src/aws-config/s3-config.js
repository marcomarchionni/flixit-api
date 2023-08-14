const { S3Client } = require('@aws-sdk/client-s3');

exports.s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT || undefined,
  forcePathStyle: process.env.FORCE_PATH_STYLE
    ? JSON.parse(process.env.FORCE_PATH_STYLE)
    : undefined,
});

exports.s3BaseParams = {
  Bucket: process.env.BUCKET_NAME,
};

exports.uploadImagePrefix = process.env.UPLOAD_IMAGE_PREFIX || '';
