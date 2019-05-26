

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
    "db_tables":{
        papers: 'papers',
        projects: 'projects',
        projectPapers: 'project_papers',
        users: 'users',
    },

    //local port to start the service
    "listening_port": 3001,
    //the number of element for each page
    "pagination":{
        defaultCount: 10
    },
    //the scopus parameters
    "scopus":{
        apiKey: process.env.SCOPUS_APIKEY ,
        url: "https://api.elsevier.com/content/search/scopus",
        validSearchBy: ["all","author","content","advanced"],
    },
    //the pdf parse service
    "pdf_parse_server": "http://scienceparse.allenai.org/v1",
    //the similar paper service
    "search_similar_server" : undefined, //here you can put the url of the remote(or local) service that will search for similar papers

    //the google authentication service
    "google_oauth": "https://oauth2.googleapis.com/tokeninfo",
    "google_login_client_id": process.env.GOOGLE_LOGIN_CLIENT_ID

};
