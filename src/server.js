//set environmental variables by env file
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
