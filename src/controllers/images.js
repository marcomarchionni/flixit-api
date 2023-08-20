const {
  s3Client,
  s3BaseParams,
  imagePrefix,
  getImageKey,
  getResizedImageKey,
} = require('../aws-config/s3-config');
const {
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const fileType = require('file-type');
const mime = require('mime');
const NoFileToUploadError = require('../error-handling/errors/no-file-to-upload-error');
const S3Error = require('../error-handling/errors/s3-error');
const NoFilenameError = require('../error-handling/errors/no-filename-error');
const { Movies } = require('../models/models');
const NoMovieWithIdError = require('../error-handling/errors/no-movie-with-id-error');

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
      Key: imagePrefix + image.name,
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

exports.uploadMovieImage = async (req, res, next) => {
  try {
    // Check if the image file exists
    if (!req.files) throw new NoFileToUploadError();

    // Check if the file is an image
    const image = req.files.image;
    const type = await fileType.fromBuffer(image.data);
    if (!type || type.mime.indexOf('image/') !== 0)
      throw new NoImageFileError();

    // Check if movieId exists
    const movieId = req.params.movieId;
    const movie = await Movies.findById(movieId);
    if (!movie) throw new NoMovieWithIdError();

    // Put image in S3 bucket
    const imageKey = getImageKey(movieId, image.name);
    console.log(imageKey);
    const putObjectParams = {
      ...s3BaseParams,
      Key: imageKey,
      Body: image.data,
    };
    const putObjectCmd = new PutObjectCommand(putObjectParams);
    await s3Client.send(putObjectCmd).catch((err) => {
      throw new S3Error(err);
    });

    // Add database image reference
    const resizedImageKey = getResizedImageKey(movieId, image.name);
    console.log(resizedImageKey);
    const updatedMovie = await Movies.findByIdAndUpdate(
      movieId,
      { $push: { imageKeys: imageKey, resizedImageKeys: resizedImageKey } },
      { new: true }
    );

    // response
    res.json(updatedMovie);
  } catch (err) {
    next(err);
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
