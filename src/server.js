//get environmental variables from env file
require('dotenv').config();

//the config file
const config = require(__dirname + "/" + 'config');

const app = require('./app');

const PORT = process.env.PORT || config.listening_port;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
