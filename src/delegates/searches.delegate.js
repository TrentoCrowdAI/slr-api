// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.
//library to parse XML string to object
const XMLParser = require('fast-xml-parser');
const parserOptions = {
    ignoreAttributes: false,
};


const searchesDao = require(__base + 'dao/searches.dao');
const filtersDao = require(__base + 'dao/filters.dao');
const usersDao = require(__base + 'dao/users.dao');
const projectsDao = require(__base + 'dao/projects.dao');

//the config file
const config = require(__base + 'config');
//supply the auxiliary function
const errHandler = require(__base + 'utils/errors');
const support = require(__base + 'utils/support');
const errorCheck = require(__base + 'utils/errorCheck');
const conn = require(__base + 'utils/conn');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * insert a paper
 * @param {Object} newPaperData
 * @returns {Object} paper created
 *//*
async function insert(newPaperData) {
    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data is not valid!');
    }
    //call DAO layer
    let res = await searchesDao.insert(newPaperData);

    return res;
}
*/

/**
 *  * update a paper
 * @param {string}  paper_id
 * @param {Object} newPaperData
 *//*
async function update(paper_id, newPaperData) {

    //check validation of paper_id and transform the value in integer
    paper_id = errorCheck.setAndCheckValidPaperId(paper_id);

    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data for update is not valid!');
    }

    //call DAO layer
    let numberRow = await searchesDao.update(paper_id, newPaperData);
    //error check
    if (numberRow === 0) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

}
*/

/**
 *  * delete a paper
 * @param {string} paper_id

async function deletes(paper_id) {


    //check validation of paper_id and transform the value in integer
    paper_id = errorCheck.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let numberRow = await searchesDao.deletes(paper_id);

    //error check
    if (numberRow === 0) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
}*/


/**
 * select a paper
 * @param {string} paper_id
 * @returns {Object} paper found
 *//*
async function selectById(paper_id) {

    //check validation of paper_id and transform the value in integer
    paper_id = errorCheck.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let res = await searchesDao.selectById(paper_id);
    //error check

    if (!res) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

    return res;
}*/

/**
 * wrapper function for searching
 * @param {string} keyword
 * @param {string} searchBy
 * @param {string} year
 * @param {string} orderBy
 * @param {string} sort
 * @param {string} start
 * @param {string} count
 * @param {string} scopus
 * @param {string} arXiv
 * @returns {Object} array of papers and total number of result
 */
async function search(keyword, searchBy, year, orderBy, sort, start, count, scopus, arXiv) {

    let res;

    if (scopus === "true") {

        res = await scopusSearch(keyword, searchBy, year, orderBy, sort, start, count);
    }
    else if (arXiv === "true") {

        res = await arxivSearch(keyword, searchBy, orderBy, sort, start, count);
    }
    else {
        throw errHandler.createBadRequestError("the source of search is empty");
    }

    return res;

}

/**
 *
 * find papers by searching with the Scopus APIs
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content, advanced] "content" means abstracts+keywords+titles.
 * @param {string} year specific year to search
 * @param {string} orderBy [date, title]
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function scopusSearch(keyword, searchBy, year, orderBy, sort, start, count) {

    //check the validation of parameters
    errorCheck.isValidKeyword(keyword);
    searchBy = errorCheck.setAndCheckValidSearchByForScopus(searchBy);
    year = errorCheck.setAndCheckValidYearForScopus(year);
    orderBy = errorCheck.setAndCheckValidOrderByForScopus(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //prepare the query object
    let queryData = {};
    queryData.apiKey = config.scopus.apiKey;

    //searchBy condition
    switch (searchBy) {
        case config.validSearchBy[0]:
            queryData.query = "ALL(\"" + keyword + "\")";
            break;
        case config.validSearchBy[1]:
            queryData.query = "AUTHOR-NAME(\"" + keyword + "\")";
            break;
        case config.validSearchBy[2]:
            queryData.query = "TITLE-ABS-KEY(\"" + keyword + "\")";
            break;
        case config.validSearchBy[3]:
            queryData.query = keyword;
            break;
    }


    //date range condition
    if (year !== "") {
        queryData.date = year;
    }

    //sort condition
    if (orderBy === "date") {
        orderBy = "coverDate";
    }
    else {
        orderBy = "publicationName";
    }

    if (sort === "ASC") {
        sort = "+";
    }
    else {
        sort = "-";
    }
    queryData.sort = sort + orderBy;

    //number of papers and offset
    queryData.start = start;
    queryData.count = count;

    //send request get to scopus service
    let response = await conn.get(config.scopus.url, queryData);

    //if there is the error from fetch
    if (response.message) {
        throw errHandler.createBadImplementationError(response.message);
    }

    //get total number of results
    let totalResults = response['search-results']['opensearch:totalResults'];

    //if results if 0, return the 404 error
    if (totalResults === "0") {
        throw errHandler.createNotFoundError('the result is empty!');
    }

    //get paper array
    let arrayResults = response['search-results']['entry'];

    //store a new paper array
    let arrayPapers = [];
    //a eids array for our new paper array
    let arrayEid = [];

    //create a new paper array with our format
    for (let i = 0; i < arrayResults.length; i++) {

        let paper = {};
        paper.authors = arrayResults[i]["dc:creator"] || ""; //authors can be empty
        paper.title = arrayResults[i]["dc:title"] || "";
        paper.year = arrayResults[i]["prism:coverDate"].slice(0, 4) || ""; //slice only the part of year
        paper.date = arrayResults[i]["prism:coverDate"] || "";
        paper.source_title = arrayResults[i]["prism:publicationName"] || "";
        paper.link = arrayResults[i].link || "";
        paper.doi = arrayResults[i]["prism:doi"] || "";
        //to be defined in future
        paper.abstract = "I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.";

        paper.document_type = arrayResults[i].subtypeDescription || "";
        paper.source = "Scopus";
        paper.eid = arrayResults[i].eid || "";

        paper.abstract_structured = "";
        paper.filter_oa_include = "";
        paper.filter_study_include = "";
        paper.notes = "";
        paper.manual = "0";

        //push element in array
        arrayPapers.push(paper);
        arrayEid.push(arrayResults[i].eid);
    }


    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayEidExisting = await searchesDao.checkExistenceByEids(arrayEid);
    //remove the eids already presented in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await searchesDao.insertByList(arrayPapersToInsert);
    }


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}


/**
 *
 * find papers by searching with the arXiv APIs
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content, advanced] "content" means abstracts+keywords+titles.
 * @param {string} year specific year to search
 * @param {string} orderBy [date, title]
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function arxivSearch(keyword, searchBy, orderBy, sort, start, count) {

    //check the validation of parameters
    errorCheck.isValidKeyword(keyword);
    searchBy = errorCheck.setAndCheckValidSearchByForScopus(searchBy);
    orderBy = errorCheck.setAndCheckValidOrderByForScopus(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //prepare the query object
    let queryData = {};

    //searchBy condition
    switch (searchBy) {
        case config.validSearchBy[0]:
            queryData.search_query = "all:\"" + keyword + "\"";
            break;
        case config.validSearchBy[1]:
            queryData.search_query = "au:\"" + keyword + "\"";
            break;
        case config.validSearchBy[2]:
            queryData.search_query = "ti:\"" + keyword + "\" OR abs:\"" + keyword + "\"";
            break;
        case config.validSearchBy[3]:
            queryData.search_query = keyword;
            break;
    }

    //sort condition
    if (orderBy === "date") {
        queryData.sortBy = "submittedDate";
    }
    else {
        queryData.sortBy = "relevance";
    }

    if (sort === "ASC") {
        queryData.sortOrder = "ascending";
    }
    else {
        queryData.sortOrder = "descending";
    }

    //number of papers and offset
    queryData.start = start;
    queryData.max_results = count;

    //send request get to scopus service
    let responseXML = await conn.getRaw(config.arxiv.url, queryData);
    //console.log(responseXML);
    //if the error.message is defined
    if (responseXML.message) {
        throw errHandler.createBadImplementationError("error connecting to arXiv");
    }
    let respnseObject = XMLParser.parse(responseXML, parserOptions);
    let results = respnseObject.feed;

    //get total number of results
    let totalResults = results['opensearch:totalResults']['#text'];
    //if results if 0, return the 404 error
    if (totalResults === 0) {
        throw errHandler.createNotFoundError('the result is empty!');
    }


    //get paper array
    let arrayResults = results.entry;

    //store a new paper array
    let arrayPapers = [];
    //a ids array for our new paper array
    let arrayId = [];

    //create a new paper array with our format
    for (let i = 0; i < arrayResults.length; i++) {

        let paper = {};

        let authors = arrayResults[i]["author"];
        //if is an array of author
        if (Array.isArray(authors)) {
            paper.authors = support.arrayOfObjectToString(authors, "name", ",", "");
        }
        //else if is a single author object
        else if (authors.name) {
            paper.authors = authors.name;
        }
        else {
            paper.authors = "";
        }

        paper.title = arrayResults[i]["title"] || "";
        paper.year = arrayResults[i]["published"].slice(0, 4) || ""; //slice only the part of year
        paper.date = arrayResults[i]["published"] || "";
        paper.source_title = arrayResults[i]["title"] || "";
        paper.link = arrayResults[i].link || "";
        if (arrayResults[i]["arxiv:doi"]) {
            paper.doi = arrayResults[i]["arxiv:doi"]["#text"];
        }
        else {
            paper.doi = "";
        }

        paper.abstract = arrayResults[i]["summary"] || "";

        paper.document_type = "";
        paper.source = "arXiv";

        //set id
        //ex: http://arxiv.org/abs/1607.01400v1
        let arXivId = arrayResults[i].id;
        //get index of last "/"
        let index = arXivId.lastIndexOf("/");
        //split id string , ex: 1607.01400v1
        paper.eid = arXivId.slice(index + 1, arXivId.length) || "";

        paper.abstract_structured = "";
        paper.filter_oa_include = "";
        paper.filter_study_include = "";
        paper.notes = "";
        paper.manual = "0";

        //push element in array
        arrayPapers.push(paper);
        arrayId.push( paper.eid);
    }


    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayIdExisting = await searchesDao.checkExistenceByEids(arrayId);
    //remove the eids already presented in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayIdExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await searchesDao.insertByList(arrayPapersToInsert);
    }


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}


/**
 *
 * find similar papers
 * @param {Object} paperData of the paper to search for similarity
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function similarSearch(paperData, start, count) {


    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //error check
    if (!paperData) {
        throw errHandler.createBadRequestError("there's no paper to search for!");
    }

    //prepare the query object
    let queryData = {};
    queryData.paperData = paperData;
    //number of papers and offset
    queryData.start = start;
    queryData.count = count;

    //fetchData from scopus
    let response = null;

    /*###########################################
    call the service
    ###########################################*/

    response = await conn.post(config.search_similar_server, queryData);


    //if there is the error from fetch
    if (response.message == "Not Found") {
        throw errHandler.createNotFoundError(response.message);
    }
    else if(response.message){
        throw errHandler.createBadImplementationError(response.message);
    }

    //###########################################
    //handle the response from the server
    //###########################################

    //get paper array
    let arrayResults = response.results;

    //store a new paper array
    let arrayPapers = [];
    //a eids array for our new paper array
    let arrayEid = [];

    //create a new paper array with our format(this will change a lot based on the service used)
    for (let i = 0; i < arrayResults.length; i++) {

        let paper = arrayResults[i];
        //fix the source of paper
        paper.source = "similar-search service";

        //push element in array
        arrayPapers.push(paper);
        arrayEid.push(arrayResults[i].eid);
    }

    //###########################################
    //save the results in our local database before returning it
    //###########################################

    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayEidExisting = await searchesDao.checkExistenceByEids(arrayEid);
    //remove the paper already present in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await searchesDao.insertByList(arrayPapersToInsert);
    }


    //return the array of papers get from external service and total number of results
    return {"results": arrayPapers, "totalResults": response.totalResults};

}




/**
 *
 * automated search on a specific topic
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} min_confidence minimum confidence value of post
 * @param {string} max_confidence maximum confidence value of post
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function automatedSearch(user_email, project_id, min_confidence, max_confidence, start, count){



    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check and set the confidence value
    min_confidence = errorCheck.setAndCheckValidMinConfidenceValue(min_confidence);
    max_confidence = errorCheck.setAndCheckValidMaxConfidenceValue(max_confidence);

    if (max_confidence < min_confidence ) {
        throw errHandler.createBadRequestError('the max_confidence cannot be less than min_confidence!');
    }

    //check pagination parameters
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);


    //call DAO layer
    let filters = await filtersDao.selectAllByProject(project_id);



    //prepare the query object
    let queryData = {};
    queryData.title = project.data.name;
    queryData.description = project.data.description;
    queryData.arrayFilter = filters;
    //confidence value
    queryData.min_confidence = min_confidence;
    queryData.max_confidence = max_confidence;

    //number of papers and offset
    queryData.start = start;
    queryData.count = count;

    //fetchData from scopus
    let response = null;

    /*###########################################
     call the service
     ###########################################*/
    response = await conn.post(config.automated_search_server, queryData);

    //if there is the error from fetch
    if (response.message == "Not Found") {
        throw errHandler.createNotFoundError(response.message);
    }
    else if(response.message){
        throw errHandler.createBadImplementationError(response.message);
    }
    //###########################################
    //handle the response from the server
    //###########################################

    //get paper array
    let arrayResults = response.results;

    //store a new paper array
    let arrayPapers = [];
    //a eids array for our new paper array
    let arrayEid = [];

    //create a new paper array with our format(this will change a lot based on the service used)
    //for each paper
    for (let i = 0; i < arrayResults.length; i++) {

        //get paper
        let paper = arrayResults[i];
        //fix the source of paper
        paper.source = "automatic-search service";

        //push paper in new array
        arrayPapers.push(paper);
        //save paper's eid
        arrayEid.push(arrayResults[i].eid);
    }

    //###########################################
    //save the results in our local database before returning it
    //###########################################

    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayEidExisting = await searchesDao.checkExistenceByEids(arrayEid);
    //remove the paper already present in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await searchesDao.insertByList(arrayPapersToInsert);
    }


    //return the array of papers get from external service and total number of results
    return {"results": arrayPapers, "totalResults": response.totalResults};

}




module.exports = {
    //insert,
    //update,
    //deletes,
    //selectById,
    //selectAll,
    //selectBySingleKeyword,
    search,
    scopusSearch,
    arxivSearch,
    similarSearch,
    automatedSearch,

};