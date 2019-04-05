// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const papersDao = require(__base + 'dao/papers.dao');

//the config file
const config = require(__base + 'config');
//supply the auxiliary function
const errHandler = require(__base + 'utils/errors');
const support = require(__base + 'utils/support');
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
 * @param {int}  paper_id
 * @param {object} newPaperData
 */
async function update(paper_id, newPaperData) {
    //error check
    if (paper_id === undefined || paper_id === null) {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id)) {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
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
 * @param {number} paper_id
 */
async function deletes(paper_id) {


    //check validation of paper_id and transform the value in integer
    paper_id = support.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let numberRow = await papersDao.deletes(paper_id);

    //error check
    if (numberRow === 0) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
}


/**
 * select a paper
 * @param {number} paper_id
 * @returns {object} paper found
 */
async function selectById(paper_id) {

    //check validation of paper_id and transform the value in integer
    paper_id = support.setAndCheckValidPaperId(paper_id);

    //call DAO layer
    let res = await papersDao.selectById(paper_id);
    //error check

    if (res === undefined) {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

    return res;
}


/**
 *
 * find papers by searching with the Scopus APIs
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content] "content" means abstracts+keywords+titles.
 * @param {string} year specific year to search
 * @param {string} orderBy [date, title]
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function scopusSearch(keyword, searchBy, year, orderBy, sort, start, count) {

    //check the validation of parameters
    support.isValidKeyword(keyword);
    sort = support.setAndCheckValidSort(sort);
    start = support.setAndCheckValidStart(start);
    count = support.setAndCheckValidCount(count);

    /*=============
     temporary parameter
     * ============ */

    orderBy = orderBy || "date";
    if (orderBy !== "date" && orderBy !== "title" ) {
        throw errHandler.createBadRequestError('orderBy has a not valid value!');
    }

    searchBy = searchBy || "all";
    if (searchBy !== "all" && searchBy !== "author" && searchBy !== "content") {
        throw errHandler.createBadRequestError('searchBy has a not valid value!');
    }

    year = Number(year) || "";
    if (year !== "" && !Number.isInteger(year)) {
        throw errHandler.createBadRequestError('year has a not valid value!');
    }

    /*================= */


    //prepare the query object
    let queryData = {};
    queryData.apiKey = config.scopus.apiKey;
    //serchBy condition
    let query;
    switch (searchBy) {
        case "all":
            query = "ALL(\""+keyword+"\")";
            break;
        case "author":
            query = "AUTHOR-NAME(\""+keyword+"\")";
            break;
        case "content":
            query = "TITLE-ABS-KEY(\""+keyword+"\")";
            break;
    }
    queryData.query = query;

    //date range condition
    if(year !== ""){
        queryData.date = year;
    }

    //sort condition
    if(orderBy === "date"){
        orderBy = "coverDate";
    }
    else{
        orderBy = "publicationName";
    }
    if(sort === "ASC"){
        sort ="+";
    }
    else{
        sort ="-";
    }
    queryData.sort=sort+orderBy;

    //number of papers and offset
    queryData.start = start;
    queryData.count =count;

    //fetchData from scopus
    let response = await conn.get(config.scopus.url, queryData);

    //if there is the error from fetch
    if (response.message) {
        throw errHandler.createBadImplementationError('the server could not get response from scopus!');
    }

    //get total number of results
    let totalResults = response['search-results']['opensearch:totalResults'];
    //if results if 0, return the 404 error
    if (totalResults === "0")
    {
        throw errHandler.createNotFoundError('the result is empty!');
    }

    //get paper array
    let arrayResults = response['search-results']['entry'];

    //store a new paper array
    let arrayPapers=[];
    //a eids array for our new paper array
    let arrayEid = [];

    //create a new paper array with our format
    for(let i = 0; i < arrayResults.length; i++) {

        let paper = {};
        paper.authors = arrayResults[i]["dc:creator"] || ""; //authors can be empty
        paper.title = arrayResults[i]["dc:title"] || "";
        paper.year = arrayResults[i]["prism:coverDate"].slice(0,4) || ""; //slice only the part of year
        paper.date = arrayResults[i]["prism:coverDate"] || "";
        paper.source_title = arrayResults[i]["prism:publicationName"] || "";
        paper.link = arrayResults[i].link || "";

        //to be defined in future
        paper.abstract = "I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.";

        paper.document_type = arrayResults[i].subtypeDescription || "";
        paper.source = "Scopus";
        paper.eid = arrayResults[i].eid || "";

        paper.abstract_structured ="";
        paper.filter_oa_include ="";
        paper.filter_study_include ="";
        paper.notes ="";


        //push element in array
        arrayPapers.push(paper);
        arrayEid.push(arrayResults[i].eid);
    }


    //return array of eids where in which the paper with same eid are already stored  in DB
    let arrayEidExisting = await  papersDao.checkExistenceByEids(arrayEid);
    //remove the paper already present in DB
    let arrayPapersToInsert = support.removeElementFromArrayByEids(arrayPapers, arrayEidExisting);

    //if there are the new papers
    if(arrayPapersToInsert.length > 0){

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
 * @param {int} number number of papers
 * @param {int} offset position where we begin to get
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
 let errorMessage = support.areValidListParameters(number, 1, orderBy, sort);//temporary fix for pagination
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
 * @param {integer} number number of papers
 * @param {integer} after id where we begin to get
 * @param {integer} before id where we begin to get backwards
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
 let errorMessage = support.areValidPaginationParameters(number, after, before, "id", "ASC");//the last ones are not used yet
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
    scopusSearch
};