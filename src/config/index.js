


module.exports = {
    "db": {
        // were not used
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,

        // heroku postgres adds automatically DATABASE_URL.
        url: process.env.DATABASE_URL
    },

    "pagination":{
        defaultCount: 10

    },

    "scopus":{
        apiKey: "1c828574217f856f6cf496239684fed4",
        url: "https://api.elsevier.com/content/search/scopus",
    },

    "pdf_parse_server": "http://scienceparse.allenai.org/v1",
    "search_similar_server" : undefined, //here you can put the url of the remote(or local) service that will search for similar papers

    "google_oauth": "https://oauth2.googleapis.com/tokeninfo",
    "google_login_client_id": "282160526683-84sdnoqh3bc1obojfpepcbonnfg3uks4.apps.googleusercontent.com"

};
