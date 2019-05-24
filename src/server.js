//set environmental variables by env file
require('dotenv').config();

//the config file
const config = require(__base + 'config');

const app = require('./app');

const PORT = process.env.PORT || config.listening_port;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
