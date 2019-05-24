//set environmental variables by env.test file
global.__base = __dirname + '/src/';
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
