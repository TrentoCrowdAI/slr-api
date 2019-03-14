// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const papersDao = require(__base + 'dao/papers.dao');
const errHandler = require(__base + 'utils/errors');
//the packaged for input validation
const validationSchemes = require(__base + 'utils/validation.schemes');
const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * insert a paper
 * @param {object} newPaperData
 * @returns {object} paper created
 */
async function insert(newPaperData) {

    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new paper data is not valid!');
    }

    let res = await papersDao.insert(newPaperData);

    return  res;
}


/**
 *  * update a paper
 * @param {integer}  paper_id
 * @param {object} newPaperData
 
 */
async function update(paper_id, newPaperData) {

    if (paper_id === undefined)
    {
        throw errHandler.createBadRequestError('Paper id  is not defined!');
    }
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    
    let valid = ajv.validate(validationSchemes.paper, newPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new paper data for update is not valid!');
    }

    let numberRow = await papersDao.update(paper_id, newPaperData);
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }

}


/**
 *  * delete a paper
 * @param {integer} id paper id
 */
async function deletes(id) {

    if (id === undefined)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    if (!Number.isInteger(id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }

    let numberRow = await papersDao.deletes(id);
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Paper does not exist!');
    }
}


/**
 * select a paper
 * @param {integer} id paper id
 * @returns {object} paper found
 */
async function selectById(id) {

    if (id === undefined)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    if (!Number.isInteger(id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }

    let res = await papersDao.selectById(id);
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

    if (number === undefined || offset === undefined || orderBy === undefined || sort === undefined)
    {
        throw errHandler.createBadRequestError('the paramters are not defined!');
    }
    if (!Number.isInteger(number) || !Number.isInteger(offset))
    {
        throw errHandler.createBadRequestError('the number or offset is not a integer!');
    }
    if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted"))
    {
        throw errHandler.createBadRequestError('the orderBy is not valid!');
    }
    if (!(sort === "ASC" || sort === "DESC"))
    {
        throw errHandler.createBadRequestError('the sort is not valid!');
    }

    let res = await papersDao.selectAll(number, offset, orderBy, sort);
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
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers 
 */
async function selectBySingleKeyword(keyword, number, offset, orderBy, sort) {

    if (keyword === undefined || number === undefined || offset === undefined || orderBy === undefined || sort === undefined)
    {
        throw errHandler.createBadRequestError('the paramters are not defined!');
    }
    if (keyword === "")
    {
        throw errHandler.createBadRequestError('the keyword is empty!');
    }
    if (!Number.isInteger(number) || !Number.isInteger(offset))
    {
        throw errHandler.createBadRequestError('the number or offset is not a integer!');
    }
    if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted"))
    {
        throw errHandler.createBadRequestError('the orderBy is not valid!');
    }
    if (!(sort === "ASC" || sort === "DESC"))
    {
        throw errHandler.createBadRequestError('the sort is not valid!');
    }

    let res = await papersDao.selectBySingleKeyword(keyword, number, offset, orderBy, sort);
    if (res.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}




module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword
};