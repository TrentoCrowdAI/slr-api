module.exports = {

    //local port to start the service
    "listening_port": 3001,

    //the url of home
    "home_url": process.env.HOME_URL,

    "db": {
        // heroku postgres adds automatically DATABASE_URL.
        url: process.env.DATABASE_URL,

        // were not used
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE
    },

    //the name of db tables in DB
    "db_tables": {
        searches: 'searches',
        projects: 'projects',
        projectPapers: 'project_papers',
        users: 'users',
        filters: 'filters',
        votes: 'votes',
        screenings: 'screenings',
    },

    //the number of element for each page
    "pagination": {
        defaultCount: 10
    },

    //the google authentication service
    "google": {
        "google_login_client_id": process.env.GOOGLE_LOGIN_CLIENT_ID,
        "google_gmail": process.env.GOOGLE_GMAIL,
        "google_gmail_pwd": process.env.GOOGLE_GMAIL_PWD
    },


    //the arXiv search service
    "arxiv": {
        url: "http://export.arxiv.org/api/query"
    },
    //the scopus search service
    "scopus": {
        apiKey: process.env.SCOPUS_APIKEY,
        url: "https://api.elsevier.com/content/search/scopus",
    },

    //valid keywords for searchBy
    validSearchBy: ["all", "author", "content", "advanced"],

    //the variable to save the file
    "file": {
        //the directory to save the uploaded file
        "tmp_directory": "./tmp/",
        //maximum number of files in tmp folder, in any case it must be >=1
        "max_number": 20
    },


    //the variable to indicate the status of screening
    "screening_status": {
        "manual": "manual",
        "screened": "screened",
        "backlog": "backlog",
        "all": "all"

    },

    //the variable to indicate the type of screening
    "screening_source": {
        "manual_screening": "manual screening",
        "automated_screening": "automated screening"
    },

    //the variable to indicate the sub-type of manual screening
    "manual_screening_type": {
        "single_predicate": "single-predicate",
        "multi_predicate": "multi-predicate",

    },


    /*================================path of external service================================*/
    /*to change in the future*/

    //the pdf parse service
    "pdf_parse_server": "http://scienceparse.allenai.org/v1",

    //the similar paper service
    "search_similar_server": process.env.BACKEND_URL + "external/similarSearch",

    //automated search service
    "automated_search_server": process.env.BACKEND_URL + "external/automatedSearch",

    //automated evaluation service for auto screening
    "automated_evaluation_server": process.env.BACKEND_URL + "external/automatedEvaluation",
};
