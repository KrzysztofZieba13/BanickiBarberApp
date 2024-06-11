const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Konfiguracja zmiennych środowiskowych
dotenv.config({ path: './config.env' });

// Import aplikacji Express
const app = require('./appServer');

// Konfiguracja połączenia z bazą danych

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Połączenie z bazą danych
mongoose
  .connect(DB, { autoIndex: true })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Ustawienie portu i uruchomienie serwera
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
