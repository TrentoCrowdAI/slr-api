// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.
//library to parse XML string to object


const papersDelegate = require(__base + 'delegates/papers.delegate');
const papersDao = require(__base + 'dao/papers.dao');

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
    let response = await papersDelegate.scopusSearch(relevantQuery, undefined, undefined, undefined, "ASC", start, count);

    return response;
}

    /**
     *
     * fake external  automated  search
     * @param {string} title
     * @param {string} description
     * @param {array[]} arrayFilter
     * @param {string} start offset position where we begin to get
     * @param {string} count number of papers
     * @returns {Object} array of papers and total number of result
     */
    async function fakeAutomatedSearchService(title, description, arrayFilter, start, count) {

        //split string in array by space
        let titleArray = title.split(" ");
        let descriptionArray = description.split(" ");

        //initial the query string
        let query = "ALL(";

        //concatenate the array to string of or
        let titleQuery =support.arrayToString(titleArray, " OR ", "");
        let descriptionQuery = support.arrayToString(descriptionArray, " OR ", "");

        //if there aren't both empty , surround the string with parentheses
        if(titleQuery!== "" && descriptionQuery!== "" ){
            query += "("+titleQuery+" OR "+descriptionQuery+")"
        }
        else if(titleQuery!== ""){
            query += "("+titleQuery+")";
        }
        else if(descriptionQuery!== "" ){
            query += "("+descriptionQuery+")";
        }

        //get inclusion and exlusion keywords from list of fiters
        let inclusionString ="";
        let exclusionString ="";
        let tempArrayOfInclusion;
        let tempArrayOfExclusion;
        for(let i =0 ; i<arrayFilter.length; i++){
            //get split array of inclusion of current filter
            tempArrayOfInclusion = arrayFilter[i].data.inclusion_description.split(" ");
            //get split array of exclusion of current filter
            tempArrayOfExclusion = arrayFilter[i].data.exclusion_description.split(" ");
            //concatenate the array to string of or
            inclusionString += support.arrayToString(tempArrayOfInclusion, " OR ", "");
            //concatenate the array to string of or
            exclusionString +=support.arrayToString(tempArrayOfExclusion, " OR ", "");

            //if it isn't last cycle and array of inclusion is not empty
            if(i < arrayFilter.length-1 && tempArrayOfInclusion.length > 0){
                inclusionString += " OR ";
            }
            //if it isn't last cycle and array of exclusion is not empty
            if(i < arrayFilter.length-1 && tempArrayOfExclusion.length > 0){
                exclusionString +=" OR ";
            }
        }

        if(inclusionString !== ""){
            query += " AND ("+inclusionString+")"
        }
        if(exclusionString !== ""){
            query += " AND NOT ("+exclusionString+")"
        }

        query += ")";

       // console.log(query);

        //###########################################
        //call for the service
        //###########################################


       let  response = await automatedScopusSearch(query, "advanced", "ASC", start, count);

        return response;

    }

/**
 *
 * find papers by searching with the Scopus APIs
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content, advanced] "content" means abstracts+keywords+titles.
 * @param {string} year specific year to search
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function automatedScopusSearch(keyword, searchBy, sort, start, count) {


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

        //random confidence
        paper.confidence = Math.floor(Math.random()*100) /100 + "";

        //push element in array
        arrayPapers.push(paper);

    }


    //return the array of papers get from scopus and total number of results
    return {"results": arrayPapers, "totalResults": totalResults};

}



module.exports = {
        fakeSimilarSearchService,
        fakeAutomatedSearchService,
    };