global.__base = __dirname + '/';

const express = require('express');
const bodyParser = require('body-parser');
//HTTP-friendly error objects
const Boom = require('boom');

//management error
const errorsHelper = require('./utils/errors');
//controller for search, access and management of papers
const papersController = require('./controllers/papers.controller'); 

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});


// define routes here
app.use(papersController);

//manages the object error threw by level delegate
app.use((e, req, res, next) => {
  
    
  console.error('[Error]', e);
 
  let error = errorsHelper.createBoomErrorForService(e);

  res.status(error.output.statusCode).send(error.output);
});

module.exports = app;
