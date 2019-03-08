global.__base = __dirname + '/';

const express = require('express');
const bodyParser = require('body-parser');
const Boom = require('boom');

const errorsHelper = require('./utils/errors');
const papersController = require('./controllers/papers.controller'); //controller for search, access and management of papers

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});


// define routes here
app.use(papersController);

app.use((e, req, res, next) => {
  console.error('[Error]', e);
  let error = errorsHelper.createServiceError(e);


  if (error.status === 401 && !error.isBoom) {
    const message = 'Not authorized to perform the request';
    error = Boom.unauthorized(message);
  }

  if (!error.isBoom) {
    error = Boom.badImplementation();
  }
  res.status(error.output.statusCode).send(error.output);
});
module.exports = app;
