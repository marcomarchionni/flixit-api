const express = require('express'),
  morgan = require('morgan');
const app = express();
const movies = [
  {
    title: 'My Name Is Nobody',
    director: 'Tonino Valerii',
    writers: ['Sergio Leone', 'Fulvio Morsella', 'Ernesto Gastaldi'],
    stars: ['Terence Hill', 'Henry Fonda', 'Jean Martin'],
    year: 1973,
  },
  {
    title: 'Django',
    director: 'Sergio Corbucci',
    writers: ['Sergio Corbucci', 'Bruno Corbucci', 'Franco Rossetti'],
    stars: ['Franco Nero', 'José Canalejas', 'José Bódalo'],
    year: 1966,
  },
  {
    title: 'A Fistful of Dollars',
    director: 'Sergio Leone',
    writers: ['Andrea Bolzoni', 'Mark Lowell', 'Víctor Andrés Catena'],
    stars: ['Clint Eastwood', 'Gian Maria Volontè', 'Marianne Koch'],
    year: 1964,
  },
  {
    title: 'Vengeance Is a Dish Served Cold',
    director: 'Pasquale Squitieri',
    writers: ['Pasquale Squitieri', 'Monica Venturini'],
    stars: ['Leonard Mann', 'Ivan Rassimov', 'Elizabeth Eversfield'],
    year: 1971,
  },
  {
    title: 'A Pistol for Ringo',
    director: 'Duccio Tessari',
    writers: ['Duccio Tessari', 'Alfonso Balcázar', "Enzo Dell'Aquila"],
    stars: ['Giuliano Gemma', 'Fernando Sancho', 'Lorella De Luca'],
    year: 1965,
  },
  {
    title: 'The Good, the Bad and the Ugly',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Luciano Vincenzoni', 'Agenore Incrocci'],
    stars: ['Clint Eastwood', 'Eli Wallach', 'Lee Van Cleef'],
    year: 1966,
  },
  {
    title: 'They Call Me Trinity',
    director: 'Enzo Barboni',
    writers: ['Enzo Barboni', 'Gene Luotto'],
    stars: ['Terence Hill', 'Bud Spencer', 'Steffen Zacharias'],
    year: 1970,
  },
  {
    title: 'For a Few Dollars More',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Fulvio Morsella', 'Luciano Vincenzoni'],
    stars: ['Clint Eastwood', 'Lee Van Cleef', 'Gian Maria Volontè'],
    year: 1965,
  },
  {
    title: 'Once Upon a Time in the West',
    director: 'Sergio Leone',
    writers: ['Sergio Leone', 'Sergio Donati', 'Dario Argento'],
    stars: ['Henry Fonda', 'Charles Bronson', 'Claudia Cardinale'],
    year: 1968,
  },
  {
    title: 'The Big Gundown',
    director: 'Sergio Sollima',
    writers: ['Franco Solinas', 'Fernando Morandi', 'Sergio Donati'],
    stars: ['Lee Van Cleef', 'Tomas Milian', 'Walter Barnes'],
    year: 1967,
  },
];

// Logger
app.use(morgan('common'));

// Static Requests
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to the Spaghetti Western API');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred');
});

// Listen for requests
app.listen(8080, () => {
  console.log('Spaghetti Western App is listening on port 8080.');
});
