


module.exports = {
    db: {

        // were not used
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,

        // heroku postgres adds automatically DATABASE_URL.
        url: process.env.DATABASE_URL
    }
};
