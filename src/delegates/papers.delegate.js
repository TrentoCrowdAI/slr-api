// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const papersDao = require(__base + 'dao/papers.dao');

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
 * @param {object} newPaperData
 * @returns {object} paper created
 */
async function insert(newPaperData) {
    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data is not valid!');
    }
    //call DAO layer
    let res = await papersDao.insert(newPaperData);

    return res;
}


/**
 *  * update a paper
 * @param {string}  paper_id
 * @param {object} newPaperData
 */
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
    let numberRow = await papersDao.update(paper_id, newPaperData);
    //error check
    if (numberRow === 0) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

}


/**
 *  * delete a paper
 * @param {string} paper_id
 */
async function deletes(paper_id) {


    //check validation of paper_id and transform the value in integer
    paper_id = errorCheck.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let numberRow = await papersDao.deletes(paper_id);

    //error check
    if (numberRow === 0) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
}


/**
 * select a paper
 * @param {string} paper_id
 * @returns {object} paper found
 */
async function selectById(paper_id) {

    //check validation of paper_id and transform the value in integer
    paper_id = errorCheck.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let res = await papersDao.selectById(paper_id);
    //error check

    if (!res) {
        throw errHandler.createNotFoundError('Paper does not exist!');
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
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    orderBy = errorCheck.setAndCheckValidOrderByForScopus(orderBy);
    searchBy = errorCheck.setAndCheckValidSearchByForScopus(searchBy);
    year = errorCheck.setAndCheckValidYearForScopus(year);

    //prepare the query object
    let queryData = {};
    queryData.apiKey = config.scopus.apiKey;
    //searchBy condition
    let query;
    switch (searchBy) {
        case config.scopus.validSearchBy[0]:
            query = "ALL(\"" + keyword + "\")";
            break;
        case config.scopus.validSearchBy[1]:
            query = "AUTHOR-NAME(\"" + keyword + "\")";
            break;
        case config.scopus.validSearchBy[2]:
            query = "TITLE-ABS-KEY(\"" + keyword + "\")";
            break;
        case config.scopus.validSearchBy[3]:
            query = keyword;
            break;
    }
    queryData.query = query;

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
    let arrayEidExisting = await papersDao.checkExistenceByEids(arrayEid);
    //remove the eids already presented in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await papersDao.insertByList(arrayPapersToInsert);
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
    if(!paperData){
        throw errHandler.createBadRequestError("there's no paper to search for!");
    }
    if(paperData.file && paperData.title && paperData.title !== ""){
        throw errHandler.createBadRequestError("you can't input both a file and paper data");
    }
    if(paperData.file && paperData.file.mimetype.indexOf("application/pdf")=== -1){
        throw errHandler.createBadRequestError('the file is not a pdf!');
    }
    if(!paperData.title){
        throw errHandler.createBadRequestError('no paper title found');
    }

    //prepare the query object
    let queryData = {};

    //number of papers and offset
    queryData.start = start;
    queryData.count =count;

    //fetchData from scopus
    let response = null;

    //###########################################
    //call for the service
    //###########################################


    //if we have a file and the service allows file upload we can sende the file
    if(paperData.file){
        //temporary fake call for 'search similar service
        response = await scopusSearch("Trento", undefined, undefined, undefined, "ASC", start, count);
        //this can be the call when a good 'search similar' service will be found
        //response = await conn.post(config.search_similar_server, {"file" : fs.createReadStream(file.path), ...queryData});
    }
    //else if we have a query we search for similar papers based on the query(the query could be ad url to a specific paper or a DOI in the future)
    else{
        queryData.query=paperData.title;

        //temporary fake call for 'search similar service
        let splitted = paperData.title.split(" ");
        let relevantQuery = splitted[0];
        //In practice I pick the first word of the title and I search for it on scopus
        for(let i = 0; i<splitted.length; i++){
            if(splitted[i].length !== 1){
                relevantQuery = splitted[i];
                break;
            }
        }
        response = await scopusSearch(relevantQuery, undefined, undefined, undefined, "ASC", start, count);
        //response = await conn.get(config.search_similar_server, queryData);
    }

    //###########################################
    //handle the response from the server(this may change based on the service used)
    //###########################################

    //if there is the error from fetch
    if (response.message) {
        throw errHandler.createBadImplementationError(response.message);
    }

    //number of results
    let totalResults = response.totalResults;

    //if results if 0, return the 404 error
    if (totalResults === "0")
    {
        throw errHandler.createNotFoundError('the result is empty!');
    }

    //get paper array
    let arrayResults = response.results;

    //store a new paper array
    let arrayPapers=[];
    //a eids array for our new paper array
    let arrayEid = [];

    //create a new paper array with our format(this will change a lot based on the service used)
    for(let i = 0; i < arrayResults.length; i++) {

        let paper = arrayResults[i];

        //push element in array
        arrayPapers.push(paper);
        arrayEid.push(arrayResults[i].eid);
    }


    //###########################################
    //save the results in our local database before returning it
    //###########################################

    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayEidExisting = await papersDao.checkExistenceByEids(arrayEid);
    //remove the paper already present in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if (arrayPapersToInsert.length > 0) {

        //insert the papers in DB
        let res = await papersDao.insertByList(arrayPapersToInsert);
    }


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}

/**
 * deprecated function selectBySingleKeyword and selectAll
 *==========================================================================
 *
 * select all paper
 * @param {string} number number of papers
 * @param {string} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[]} array of papers
 *//*
 async function selectAll(number, offset, orderBy, sort) {

 //cast number to integer type
 number = Number(number);
 //cast offset to integer type
 offset = Number(offset);

 //will return not empty string if they are not valid
 let errorMessage = errorCheck.areValidListParameters(number, 1, orderBy, sort);//temporary fix for pagination
 if (errorMessage !== "")
 {
 throw errHandler.createBadRequestError(errorMessage);
 }

 //call DAO layer
 let res = await papersDao.selectAll(number, offset, orderBy, sort);
 //error check
 if (res.length === 0)
 {
 throw errHandler.createNotFoundError('the list is empty!');
 }
 return res;
 }


 /**
 *
 * select paper by a single keyword
 * @param {string} keyword to search
 * @param {string} number number of papers
 * @param {string} after id where we begin to get
 * @param {string} before id where we begin to get backwards
 * @param {string} orderBy
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers
 *//*
 async function selectBySingleKeyword(keyword, number, offset, orderBy, sort) {

 //set orderBy
 orderBy = orderBy || "id";
 //cast number to integer type
 number = Number(number || 10);
 if(after === undefined && before === undefined){//if 'before' and 'after' elements are not defined I set 'after' to 0 as default value
 after = 0;
 }else{
 //cast 'after' to integer type
 after = Number(after);
 //cast 'before' to integer type
 before = Number(before);
 }
 //error check
 if (keyword === undefined || keyword === null)
 {
 throw errHandler.createBadRequestError('the keyword is not defined!');
 }
 //error check
 if (keyword === "")
 {
 throw errHandler.createBadRequestError('the keyword is empty!');
 }
 //error check
 let errorMessage = errorCheck.areValidPaginationParameters(number, after, before, "id", "ASC");//the last ones are not used yet
 if (errorMessage !== "")
 {
 throw errHandler.createBadRequestError(errorMessage);
 }
 //call DAO layer
 let res = await papersDao.selectBySingleKeyword(keyword, number, after, before, orderBy, sort);
 //error check
 if (res.results.length === 0)
 {
 throw errHandler.createNotFoundError('the list is empty!');
 }

 return res;
 }
 ==========================================================================*/


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    //selectAll,
    //selectBySingleKeyword,
    scopusSearch,
    similarSearch
};