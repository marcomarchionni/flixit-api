const { s3Client, s3BaseParams } = require('../aws-config/s3-config');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

exports.addImageUrls = async (req, res, next) => {
  const movie = req.movie;
  const getMovieWihtSignedUrls = async (movie) => {
    try {
      // Add the signed urls to the movie object
      movie.imageUrls = await Promise.all(movie.imageKeys.map(createSignedUrl));
      console.log('image urls', movie.imageUrls);
      movie.resizedImageUrls = await Promise.all(
        movie.resizedImageKeys.map(createSignedUrl)
      );
      return movie;
    } catch (error) {
      next(error);
    }
  };

  req.getSignedUrlMovie = await getMovieWihtSignedUrls(movie);
  next(); // Continue to the next middleware or route handler
};

const createSignedUrl = async (key) => {
  const getCommand = new GetObjectCommand({
    ...s3BaseParams,
    Key: key,
  });
  return await getSignedUrl(s3Client, getCommand, { expiresIn: 60 * 60 });
};
