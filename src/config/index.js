
//link of database for local develpment
//must be deleted when it is online
const DATABASE_URL_FOR_LOCAL_DEV = "postgres://zhpokqpyotbcbw:25796f9e1b8eb24b62895b5b5241f73b46efd70f17c6da41257287e98602afe8@ec2-54-75-232-114.eu-west-1.compute.amazonaws.com:5432/dbhlslsutk4naa";

module.exports = {
    db: {

        // were not used
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,

        // heroku postgres adds automatically DATABASE_URL.
        url: process.env.DATABASE_URL  || DATABASE_URL_FOR_LOCAL_DEV
    }
};
