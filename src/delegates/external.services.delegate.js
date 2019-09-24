// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

//the config file
const config = require(__base + 'config');
//supply the auxiliary function
const errHandler = require(__base + 'utils/errors');
const support = require(__base + 'utils/support');
const errorCheck = require(__base + 'utils/errorCheck');
const conn = require(__base + 'utils/conn');

/**
 *
 * fake external search for similar paper
 * @param {Object} paperData of the paper to search for similarity
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function fakeSimilarSearchService(paperData, start, count) {


    //check pagination parameters
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //if title is not defined
    if (!paperData.title) {
        throw errHandler.createBadRequestError('no paper title found');
    }

    //###########################################
    //call for the service
    //###########################################

    //temporary fake call for 'search similar service
    let splitted = paperData.title.split(" ");
    let relevantQuery = splitted[0];
    //In practice I pick the first word of the title and I search for it on scopus
    for (let i = 0; i < splitted.length; i++) {
        if (splitted[i].length !== 1) {
            relevantQuery = splitted[i];
            break;
        }
    }

    //fake service
    let response = await scopusSearchWithoutSave(relevantQuery, undefined, undefined, undefined, "ASC", start, count);

    return response;
}


/**
 *internal function for fake similar search service without save the paper in the DB
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
async function scopusSearchWithoutSave(keyword, searchBy, year, orderBy, sort, start, count) {

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


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}

/**
 *
 * fake external  automated  search
 * @param {string} title
 * @param {string} description
 * @param {Object[]} arrayFilter
 * @param {string} min_confidence minimum confidence value of post
 * @param {string} max_confidence maximum confidence value of post
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function fakeAutomatedSearchService(title, description, arrayFilter, min_confidence, max_confidence, start, count) {

    //if the title is not defined
    if (!title) {
        throw errHandler.createBadRequestError('the title is not defined!');
    }

    //if the description is not defined
    if (!description) {
        throw errHandler.createBadRequestError('the title is not defined!');
    }

    //check  validation of array, the second parameter is a flag for allowing empty arrays
    errorCheck.isValidArray(arrayFilter, true);

    //check and set the confidence value
    min_confidence = errorCheck.setAndCheckValidMinConfidenceValue(min_confidence);
    max_confidence = errorCheck.setAndCheckValidMaxConfidenceValue(max_confidence);

    //if min confidence is large than max confidence
    if (max_confidence < min_confidence) {
        throw errHandler.createBadRequestError('the max_confidence cannot be less than min_confidence!');
    }


    //clean from scopus syntax words to avoid errors
    title = title.replace(/and|or|not/gi, "").replace(/\s+/g, " ");
    description = description.replace(/and|or|not/gi, "").replace(/\s+/g, " ");
    //split string in array by space
    let titleArray = title.split(" ").filter((x) => x);//avoid empty strings
    let descriptionArray = description.split(" ").filter((x) => x);

    //initial the query string
    let query = "ALL(";

    //concatenate the array to string of or
    let titleQuery = support.arrayToString(titleArray, " OR ", "");
    let descriptionQuery = support.arrayToString(descriptionArray, " OR ", "");

    //if there aren't both empty , surround the string with parentheses
    if (titleQuery !== "" && descriptionQuery !== "") {
        query += "(" + titleQuery + " OR " + descriptionQuery + ")"
    }
    else if (titleQuery !== "") {
        query += "(" + titleQuery + ")";
    }
    else if (descriptionQuery !== "") {
        query += "(" + descriptionQuery + ")";
    }


    //get inclusion and exlusion keywords from list of fiters
    let inclusionString = "";
    let exclusionString = "";
    let tempArrayOfInclusion;
    let tempArrayOfExclusion;
    for (let i = 0; i < arrayFilter.length; i++) {
        //console.log(i +"<"+arrayFilter.length);
        //get split array of inclusion of current filter
        tempArrayOfInclusion = arrayFilter[i].data.inclusion_description.replace(/and|or|not/gi, "").replace(/\s+/g, " ").split(" ").filter((x) => x);
        //get split array of exclusion of current filter
        tempArrayOfExclusion = arrayFilter[i].data.exclusion_description.replace(/and|or|not/gi, "").replace(/\s+/g, " ").split(" ").filter((x) => x);
        //concatenate the array to string of or
        inclusionString += support.arrayToString(tempArrayOfInclusion, " OR ", "");
        //concatenate the array to string of or
        exclusionString += support.arrayToString(tempArrayOfExclusion, " OR ", "");

        //if it isn't last cycle and array of inclusion is not empty
        if (i < arrayFilter.length - 1 && tempArrayOfInclusion.length > 1) {
            inclusionString += " OR ";
        }
        //if it isn't last cycle and array of exclusion is not empty
        if (i < arrayFilter.length - 1 && tempArrayOfExclusion.length > 1) {
            exclusionString += " OR ";
        }

    }

    if (inclusionString !== "" && inclusionString !== " OR ") {
        query += " AND (" + inclusionString + ")"
    }
    if (exclusionString !== "" && exclusionString !== " OR ") {
        query += " AND NOT (" + exclusionString + ")"
    }

    query += ")";

    // console.log(query);

    //###########################################
    //call for the service
    //###########################################

    let response = await automatedScopusSearch(query, "advanced", "ASC", start, count);

    //declare the variable for following cycle
    let randomValue;
    let sum;
    let filter;
    //range of confidence value
    let range = max_confidence - min_confidence + 0.01;

    for (let i = 0; i < response.results.length; i++) {

        //create the field "metadata"
        response.results[i].metadata = {};
        //create the sub-field "automatedSearch"
        response.results[i].metadata.automatedSearch = {};
        //copy array of filters where storage tuple of filter_id - filter_value
        response.results[i].metadata.automatedSearch.filters = [];

        sum = 0;
        for (let j = 0; j < arrayFilter.length; j++) {
            //calculate the random value for each filter
            randomValue = Math.floor(Math.random() * range * 100 + min_confidence * 100) / 100;
            sum += randomValue;
            //push filter id & value into array of filter
            response.results[i].metadata.automatedSearch.filters.push(
                {"id": arrayFilter[j].id, "filterValue": randomValue}
            );
        }

        //the average value
        let averageValue = 0;
        //if there is at least one
        if (arrayFilter.length > 0) {
            averageValue = sum / arrayFilter.length;
        }
        //else calculate directly the average value by random
        else {
            averageValue = Math.floor(Math.random() * range * 100 + min_confidence * 100) / 100;
        }

        //save the final value
        response.results[i].metadata.automatedSearch.value = averageValue + "";
    }


    return response;

}

/**
 * ===========================================================================
 *internal function only for fakeAutomatedSearchService
 * ===========================================================================
 * find papers by searching with the Scopus APIs
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content, advanced] "content" means abstracts+keywords+titles.
 * @param {string} year specific year to search
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function automatedScopusSearch(keyword, searchBy, sort, start = 0, count = 10) {
    //prepare the query object
    let queryData = {};
    queryData.apiKey = config.scopus.apiKey;

    queryData.query = keyword;

    if (sort === "ASC") {
        sort = "+";
    }
    else {
        sort = "-";
    }
    queryData.sort = sort;

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

    }


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}

/**
 * fake service for automated evaluation of confidence
 * @param {Object[]}arrayPaper array of post object
 * @param {Object[]} arrayFilter array of filter object
 * @param {string} project_id
 */

function fakeAutomatedEvaluationService(arrayPaper, arrayFilter, project_id) {

    //create response array
    let response = [];
    let element;
    //declare the variable for following cycle
    let randomValue;
    let sum;
    let filter;
    let averageValue;

    let max_confidence = 1.00;
    let min_confidence = 0.00;
    //range of confidence value
    let range = max_confidence - min_confidence + 0.01;

    //for each post
    for (let i = 0; i < arrayPaper.length; i++) {

        //create object for each paper
        //set field id
        //set field filters array
        element = {id: arrayPaper[i].id, filters: []};

        //initial the sum to 0
        sum = 0;

        //fro each filter
        for (let j = 0; j < arrayFilter.length; j++) {

            //calculate the random value for each filter
            randomValue = Math.floor(Math.random() * range * 100 + min_confidence * 100) / 100;
            //add up the value
            sum += randomValue;
            //create filter object where will storage the filter id and value
            filter = {"id": arrayFilter[j].id, "filterValue": randomValue};
            //push the filter object in the array filters of paper object
            element.filters.push(filter);

        }

        //the average value
        averageValue = 0;
        //if there is at least one
        if (arrayFilter.length > 0) {
            averageValue = sum / arrayFilter.length;
        }
        //else calculate directly the average value by random
        else {
            averageValue = Math.floor(Math.random() * range * 100 + min_confidence * 100) / 100;
        }

        //set average value of paper
        element.value = averageValue;
        //push the paper object in the response array
        response.push(element);


    }

    //I set status flag
    global["project_" + project_id] = true;

    //timeout of 3 seconds
    setTimeout(() => {

        //delete the global variable
        delete global["project_" + project_id];

    }, 3000);

    return response;

}


/**
 * get automated screening status (in percentage)
 * will return false for first request and request within 3 seconds from first request, true for the request after 3 seconds  from first request
 * @param {string} project_id
 * @returns {int} progress in percentage
 */
async function fakeGetAutomatedScreeningStatus(project_id) {


    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //if is set the global variable
    if (global["project_" + project_id]) {

        return false;
    }
    //if the global variable isn't exist
    else {
        return true;
    }

}


module.exports = {
    fakeSimilarSearchService,
    fakeAutomatedSearchService,
    fakeAutomatedEvaluationService,
    fakeGetAutomatedScreeningStatus,
};