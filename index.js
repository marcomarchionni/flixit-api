const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid');
bodyParser = require('body-parser');
const app = express();
const movies = [
  {
    id: 1,
    title: 'My Name Is Nobody',
    director: 'Tonino Valerii',
    writers: ['Sergio Leone', 'Fulvio Morsella', 'Ernesto Gastaldi'],
    stars: ['Terence Hill', 'Henry Fonda', 'Jean Martin'],
    year: 1973,
  },
  {
    id: 2,
    title: 'Django',
    director: 'Sergio Corbucci',
    writers: ['Sergio Corbucci', 'Bruno Corbucci', 'Franco Rossetti'],
    stars: ['Franco Nero', 'José Canalejas', 'José Bódalo'],
    year: 1966,
  },
  {
    id: 3,
    title: 'A Fistful of Dollars',
    director: 'Sergio Leone',
    writers: ['Andrea Bolzoni', 'Mark Lowell', 'Víctor Andrés Catena'],
    stars: ['Clint Eastwood', 'Gian Maria Volontè', 'Marianne Koch'],
    year: 1964,
  },
  {
    id: 4,
    title: 'Vengeance Is a Dish Served Cold',
    director: 'Pasquale Squitieri',
    writers: ['Pasquale Squitieri', 'Monica Venturini'],
    stars: ['Leonard Mann', 'Ivan Rassimov', 'Elizabeth Eversfield'],
    year: 1971,
  },
  {
    id: 5,
    title: 'A Pistol for Ringo',
    director: 'Duccio Tessari',
    writers: ['Duccio Tessari', 'Alfonso Balcázar', "Enzo Dell'Aquila"],
    stars: ['Giuliano Gemma', 'Fernando Sancho', 'Lorella De Luca'],
    year: 1965,
  },
  {
    id: 6,
    title: 'The Good, the Bad and the Ugly',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Luciano Vincenzoni', 'Agenore Incrocci'],
    stars: ['Clint Eastwood', 'Eli Wallach', 'Lee Van Cleef'],
    year: 1966,
  },
  {
    id: 7,
    title: 'They Call Me Trinity',
    director: 'Enzo Barboni',
    writers: ['Enzo Barboni', 'Gene Luotto'],
    stars: ['Terence Hill', 'Bud Spencer', 'Steffen Zacharias'],
    year: 1970,
  },
  {
    id: 8,
    title: 'For a Few Dollars More',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Fulvio Morsella', 'Luciano Vincenzoni'],
    stars: ['Clint Eastwood', 'Lee Van Cleef', 'Gian Maria Volontè'],
    year: 1965,
  },
  {
    id: 9,
    title: 'Once Upon a Time in the West',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Sergio Donati', 'Dario Argento'],
    stars: ['Henry Fonda', 'Charles Bronson', 'Claudia Cardinale'],
    year: 1968,
  },
  {
    id: 10,
    title: 'The Big Gundown',
    director: 'Sergio Sollima',
    writers: ['Franco Solinas', 'Fernando Morandi', 'Sergio Donati'],
    stars: ['Lee Van Cleef', 'Tomas Milian', 'Walter Barnes'],
    year: 1967,
  },
];
const directors = [
  {
    name: 'Sergio Leone',
    born: 1929,
    died: 1989,
    bio: 'The father of the Spaghetti Western',
  },
  {
    name: 'Sergio Corbucci',
    born: 1926,
    died: 1990,
    bio: 'The other Sergio',
  },
  {
    name: 'Sergio Sollima',
    born: 1921,
    died: 2015,
    bio: 'Although best known as a director of a few Spaghetti Westerns, Sollima excelled at a number of different genres.',
  },
  {
    name: 'Pasquale Squitieri',
    born: 1938,
    died: 2017,
    bio: '',
  },
];
const users = [
  {
    id: 1,
    name: 'Marco Marchionni',
    email: 'marco.marchionni@gmail.com',
  },
];

findUserById = function (id) {
  return users.find((user) => user.id == id);
};
findUserByEmail = function (email) {
  return users.find((user) => user.email == email);
};
findMovieById = function (id) {
  return movies.find((movie) => movie.id == id);
};
findDirectorById = function (id) {
  return directors.find((movie) => movie.id == id);
};

app.use(morgan('common'));
app.use(bodyParser.json());

// Static Requests
app.use(express.static('public'));

// ROOT request
app.get('/', (req, res) => {
  res.redirect('/documentation.html');
});

// GET list of ALL movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// GET a movie by title
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find((movie) => movie.title === title);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send(`Movie with title: ${title} not found`);
  }
});

// GET movies by director
app.get('/movies/directors/:director', (req, res) => {
  const director = req.params.director;
  const moviesByDirector = movies.filter(
    (movie) => movie.director === director
  );
  if (moviesByDirector.length > 0) {
    res.json(moviesByDirector);
  } else {
    res.status(404).send(`No movies from ${director} were found`);
  }
});

// GET director by name
app.get('/directors/:name', (req, res) => {
  const name = req.params.name;
  const director = directors.find((director) => director.name === name);
  if (director) {
    res.json(director);
  } else {
    res.status(404).send(`No director with name: ${name} was found`);
  }
});

// CREATE new user
app.post('/users', (req, res) => {
  let user = req.body;
  if (user && user.email) {
    const emailIsNotTaken =
      users.find((u) => u.email === user.email) === undefined;

    if (emailIsNotTaken) {
      //add user to repo
      user.id = uuid.v4();
      users.push(user);
      res.json(user);
    } else {
      res.status(400).send(`Invalid user email`);
    }
  } else {
    res.status(400).send(`Empty user data`);
  }
});

// UPDATE user name
app.put('/users/:id/:name', (req, res) => {
  const id = req.params.id;
  console.log(users);
  console.log(id);
  let user = findUserById(id);
  if (user) {
    user.name = req.params.name;
    res.json(user);
  } else {
    res.status(404).send(`User with id: ${id} not found`);
  }
});

// Add movie to user list of favourites
app.put('/users/:userId/movies/:movieId', (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  // check if user and movie are valid
  let user = findUserById(userId);
  if (!user) {
    res.status(404).send(`User with id: ${userId} not found`);
    return;
  }
  let movie = findMovieById(movieId);
  if (!movie) {
    res.status(404).send(`Movie with id: ${movieId} not found`);
    return;
  }
  // init movie list
  if (!user.movies) {
    user.movies = [];
  } else {
    // check if movie is already in the user's list of favorites
    if (user.movies.includes(movie)) {
      res
        .status(400)
        .send(
          `Movie with id: ${movieId} is already a favourite for user with id: ${userId}`
        );
      return;
    }
  }
  user.movies.push(movie);
  res.json(user);
});

// Delete movie from list of favourites
app.delete('/users/:userId/movies/:movieId', (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  let user = findUserById(userId);
  console.log(user);
  if (!user) {
    res.status(404).send(`User with id: ${userId} not found`);
    return;
  }
  let movie = findMovieById(movieId);
  if (!movie) {
    res.status(404).send(`Movie with id: ${movieId} not found`);
    return;
  }
  if (!user.movies || !user.movies.includes(movie)) {
    res
      .status(404)
      .send(`Movie with id: ${movieId} is not in user's list of favourites`);
  } else {
    user.movies.splice(
      user.movies.findIndex((m) => m === movie),
      1
    );
    res.json(user);
  }
});

// DELETE user by email
app.delete('/users/:email', (req, res) => {
  const email = req.params.email;
  const user = findUserByEmail(email);
  if (!user) {
    res.status(404).send(`User with email: ${email} not found`);
  } else {
    users.splice(
      users.findIndex((u) => u === user),
      1
    );
    console.log(users);
    res.send(`User with email: ${email} removed`);
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred');
});

// Listen for requests
app.listen(8080, () => {
  console.log('Movie App is listening on port 8080.');
});
