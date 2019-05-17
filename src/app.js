global.__base = __dirname + '/';

const express = require('express');

const bodyParser = require('body-parser');
//HTTP-friendly error objects
const Boom = require('boom');

//management error
const errorsHelper = require('./utils/errors');
//controller for papers
const papersController = require('./controllers/papers.controller');
//controller for projects
const projectsController = require('./controllers/projects.controller');
//controller for projectPapers
const projectPapersController = require('./controllers/projectPapers.controller');
//controller for uploadFile
const uploadFileController = require('./controllers/uploadFile.controller');
//controller for users management
const usersController = require('./controllers/users.controller');

const app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb', parameterLimit: 1000000}));

// health check (public endpoint)
app.get('/', (req, res) => {
    res.json({msg: 'Hello world!'});
});

//enabling CORS
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    //enable the cookie sending
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Cache-Control, Content-Type');

    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// define routes here
app.use(papersController);
app.use(projectsController);
app.use(projectPapersController);
app.use(uploadFileController);
app.use(usersController);


//manages the object error threw by level delegate
app.use((e, req, res, next) => {


    console.error('[Error]', e);

    let error = errorsHelper.createBoomErrorForService(e);

    res.status(error.output.statusCode).send(error.output);
});

module.exports = app;
