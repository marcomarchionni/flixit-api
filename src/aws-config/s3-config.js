const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

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

exports.getImageKey = (movieId, imageName) =>
  `${process.env.ORIGINAL_IMAGE_PREFIX}/${movieId}/${imageName}`;

exports.getResizedImageKey = (movieId, imageName) =>
  `${process.env.RESIZED_IMAGE_PREFIX}/${movieId}/${imageName}`;

exports.getImageUrl = (movieId, imageName) =>
  `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${process.env.ORIGINAL_IMAGE_PREFIX}/${movieId}/${imageName}`;

exports.getResizedImageUrl = (movieId, imageName) =>
  `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${process.env.RESIZED_IMAGE_PREFIX}/${movieId}/${imageName}`;

exports.createSignedUrls = (imageKey) => {
  const command = new GetObjectCommand({
    ...this.s3BaseParams,
    Key: imageKey,
  });
  return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 });
};
