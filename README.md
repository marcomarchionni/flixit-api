# FlixIt API

This application provides access to information about movies from the Golden Age of Italian Cinema (1960-1980). Users are allowed to sign up, update their personal information, and create a list of their favorite movies. The API is built with Node.js and Express.

## API Documentation

For detailed documentation of the API endpoints, please refer to the [API Documentation](./src/public/documentation.html).

## Installation

To run the FlixIt API locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your/repo.git`
2. Navigate to the project directory: `cd repo`
3. Install the dependencies: `npm install`
4. Include the following enviromental variables in a .env file:

```
    DB_CONNECTION_URI=your-mongodb-connection-uri
    JWT_SECRET=your-jwt-secret
    PORT=8080
    ALLOWED_ORIGINS=http://localhost:1234,http://anothersite.com
```

5. Start the server: `npm start`
6. The API will be accessible at `http://localhost:8080`.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Passport

## API Endpoints

- **GET /movies**: Get a list of all movies.
- **GET /movies/:title**: Get a movie by title.
- **GET /movies/directors/:director**: Get movies by director.
- **GET /movies/genres/:genreName**: Get movies by genre.
- **GET /genres/:genreName**: Get genre by name.
- **GET /directors/:directorName**: Get director by name.
- **POST /users**: Create a new user.
- **PUT /users/:username**: Update user information.
- **PUT /users/:username/movies/:movieId**: Add a movie to the user's favorite list.
- **DELETE /users/:username/movies/:movieId**: Remove a movie from the user's favorite list.
- **DELETE /users/:username**: Delete a user by username.

For detailed documentation of the API endpoints, please refer to the [API Documentation](https://itflix-api.herokuapp.com/documentation.html).
