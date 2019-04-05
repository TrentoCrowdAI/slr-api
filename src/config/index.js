


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
    },

    pagination:{
        defaultCount: 10

    },

    scopus:{
        apiKey: "1c828574217f856f6cf496239684fed4",
        url: "https://api.elsevier.com/content/search/scopus",
    }
};
