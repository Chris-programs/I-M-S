const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const i18next = require('i18next');
const backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

const mongoose = require('mongoose');
require('dotenv').config();
const bookRouter = require('./routes/books.routes');

const app = express();
const port = 3000;

i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}.json',
    },
  });

app.use(middleware.handle(i18next));
app.use(express.json());
app.use('/books', bookRouter);

// app.get('/testing', async (req, res) => {
//   res.send(req.t('testing'));
// });

app.listen(port, () => console.log(`App Listing on Port ${port}`));

const connectionString = process.env.CONNECT_STRING;

// using mongoose to connect to database
mongoose
  .connect(connectionString)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((error) => console.log(error));
