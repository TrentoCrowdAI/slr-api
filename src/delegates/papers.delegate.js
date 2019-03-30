// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const papersDao = require(__base + 'dao/papers.dao');
const errHandler = require(__base + 'utils/errors');
//supply the ausiliar function
const support = require(__base + 'utils/support');
//the packaged for input validation
const validationSchemes = require(__base + 'utils/validation.schemes');
const Ajv = require('ajv');
const ajv = new Ajv();
const fetch = require("node-fetch");

/**
 * insert a paper
 * @param {object} newPaperData
 * @returns {object} paper created
 */
async function insert(newPaperData) {
    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new paper data is not valid!');
    }
    //call DAO layer
    let res = await papersDao.insert(newPaperData);

    return  res;
}


/**
 *  * update a paper
 * @param {integer}  paper_id
 * @param {object} newPaperData
 
 */
async function update(paper_id, newPaperData) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new paper data for update is not valid!');
    }
    //call DAO layer
    let numberRow = await papersDao.update(paper_id, newPaperData);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

}


/**
 *  * delete a paper
 * @param {integer} paper_id
 */
async function deletes(paper_id) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //call DAO layer
    let numberRow = await papersDao.deletes(paper_id);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
}


/**
 * select a paper
 * @param {integer} paper_id
 * @returns {object} paper found
 */
async function selectById(paper_id) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //call DAO layer
    let res = await papersDao.selectById(paper_id);
    //error check
    if (res === undefined)
    {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
    return res;
}

/**
 * 
 * select all paper
 * @param {integer} number number of papers
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} list of papers 
 */
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
 * @param {integer} page the page we return(pages start from 1)
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers 
 */
async function selectBySingleKeyword(keyword, number, after, before, orderBy, sort) {

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

    //call DAO layer
    let res = await papersDao.selectBySingleKeyword(keyword, number, after, before, orderBy, sort);
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}

/**
 * 
 * find papers by searching with the Scopus APIs
 * @param {string} keyword to search
 * @returns {Array[Object]} array of papers 
 */
async function scopusSearch(keyword) {
    //error check
    if (keyword === undefined || keyword === null)
    {
        throw errHandler.createBadRequestError('the keyword is not defined!');
    }
    try{
        const key = "&apiKey=2c386a9c54c36a16afbb829ecc51ac16";
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        const url = "https://api.elsevier.com/content/search/scopus?start=0&count=25&query="+keyword+key;
        let response = await fetch(url, config);
        let json = await response.json();
        const res = json['search-results'].entry.map(async (element) => {
            let response = await fetch(element['prism:url']+'?field=description,authors'+key, config);
            let json = await response.json();
            return {
                    "DOI" : element['prism:doi'],
                    "Link" : element.link[1]['@href'],
                    "Url" : element['prism:url'],
                    "Date" : element['prism:coverDate'],
                    "Title" : element['dc:title'],
                    "Authors" : json['abstracts-retrieval-response'].authors.author.map(function (x) {return x['preferred-name']['ce:indexed-name']}),
                    "Abstract" : json['abstracts-retrieval-response'].coredata['dc:description'],
                    "Document Type" : element.subtypeDescription
                }
            });
        return {"results" : await Promise.all(res)}
    }catch(e){
        console.log(e);
        throw e;
    }
    
}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword,
    scopusSearch
};