const {
  s3Client,
  s3BaseParams,
  uploadImagePrefix,
} = require('../aws-config/s3-config');
const {
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const mime = require('mime');
const NoFileToUploadError = require('../error-handling/errors/no-file-to-upload-error');
const S3Error = require('../error-handling/errors/s3-error');
const NoFilenameError = require('../error-handling/errors/no-filename-error');

exports.listImages = (req, res, next) => {
  const listObjectsCmd = new ListObjectsV2Command(s3BaseParams);
  s3Client
    .send(listObjectsCmd)
    .then((listObjectResponse) => {
      res.send(listObjectResponse);
    })
    .catch(next);
};

exports.uploadImage = (req, res, next) => {
  if (req.files) {
    const image = req.files.image;

    const putObjectParams = {
      ...s3BaseParams,
      Key: uploadImagePrefix + image.name,
      Body: image.data, // The file buffer
    };

    const putObjectCmd = new PutObjectCommand(putObjectParams);

    s3Client
      .send(putObjectCmd)
      .then((response) => res.json(response))
      .catch((err) => {
        next(new S3Error(err));
      });
  } else {
    next(new NoFileToUploadError());
  }
};

exports.retrieveImage = (req, res, next) => {
  const fileName = req.params.fileName;
  if (fileName) {
    const mimeType = mime.getType(fileName) || 'application/octet-stream';
    const getObjectParams = {
      ...s3BaseParams,
      Key: fileName,
    };
    const getObjectCmd = new GetObjectCommand(getObjectParams);
    s3Client
      .send(getObjectCmd)
      .then((s3Response) => {
        res.set('Content-Type', mimeType);
        s3Response.Body.pipe(res);
      })
      .catch((err) => {
        next(new S3Error(err));
      });
  } else {
    next(new NoFilenameError());
  }
};
