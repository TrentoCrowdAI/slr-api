// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.
//library to parse XML string to object



const papersDelegate = require(__base + 'delegates/papers.delegate');

const errHandler = require(__base + 'utils/errors');

const errorCheck = require(__base + 'utils/errorCheck');


/**
 *
 * fake external search for similar paper
 * @param {Object} paperData of the paper to search for similarity
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of papers and total number of result
 */
async function fakeSimilarSearchService(paperData, start, count) {


    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //error check
    if (!paperData) {
        throw errHandler.createBadRequestError("there's no paper to search for!");
    }
    if (!paperData.title) {
        throw errHandler.createBadRequestError('no paper title found');
    }

    //prepare the query object
    let queryData = {};

    //number of papers and offset
    queryData.start = start;
    queryData.count = count;

    //fetchData from scopus
    let response = null;

    //###########################################
    //call for the service
    //###########################################


    queryData.query = paperData.title;

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
    response = await papersDelegate.scopusSearch(relevantQuery, undefined, undefined, undefined, "ASC", start, count);

    return response;

}



module.exports = {
    fakeSimilarSearchService
};