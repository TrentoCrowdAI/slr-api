//set root path
global.__base = __dirname + '/src/';
//get environmental variables from env.test file
const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '.env.test')});


module.exports = {
    verbose: true,
    globals: {
        __base: __dirname + '/src/'
    },
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: './init_db/setup_jest.js',
    globalTeardown: './init_db/teardown_jest.js'
};
