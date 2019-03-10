// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const papersDao = require(__base + 'dao/papers.dao');
const errHandler = require(__base + 'utils/errors');


/**
 * insert a paper
 * @param {object} paper
 * @returns {object} paper created
 */
async function insert(paper) {

    if (!(paper instanceof Object))
    {
        throw errHandler.create400Error('Paper is not a object!');
    }
    if (paper.content === undefined)
    {
        throw errHandler.create400Error('Paper content  is not defined!');
    }

    let res = await papersDao.insert(paper);

    return  res;
}


/**
 *  * update a paper
 * @param {object} paper
 */
async function update(paper) {

    if (!(paper instanceof Object))
    {
        throw errHandler.create400Error('Paper is not a object!');
    }
    if (paper.id === undefined)
    {
        throw errHandler.create400Error('Paper id  is not defined!');
    }
    if (!Number.isInteger(paper.id))
    {
        throw errHandler.create400Error('Paper id  is not a integer!');
    }
    if (paper.date_created === undefined)
    {
        throw errHandler.create400Error('Paper date_created  is not defined!');
    }
    if (paper.date_last_modified === undefined)
    {
        throw errHandler.create400Error('Paper date_last_modified  is not defined!');
    }
    if (paper.date_deleted === undefined)
    {
        throw errHandler.create400Error('Paper date_deleted  is not defined!');
    }
    if (paper.content === undefined)
    {
        throw errHandler.create400Error('Paper content  is not defined!');
    }

    let numberRow = await papersDao.update(paper);
    if (numberRow === 0)
    {
        throw errHandler.create404Error('Paper does not exist!');
    }

}


/**
 *  * delete a paper
 * @param {integer} id paper id
 */
async function deletes(id) {

    if (id === undefined)
    {
        throw errHandler.create400Error('Paper id is not defined!');
    }
    if (!Number.isInteger(id))
    {
        throw errHandler.create400Error('Paper id  is not a integer!');
    }

    let numberRow = await papersDao.deletes(id);
    if (numberRow === 0)
    {
        throw errHandler.create404Error('Paper does not exist!');
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
        throw errHandler.create400Error('Paper id is not defined!');
    }
    if (!Number.isInteger(id))
    {
        throw errHandler.create400Error('Paper id  is not a integer!');
    }

    let res = await papersDao.selectById(id);
    if (res === undefined)
    {
        throw errHandler.create404Error('Paper does not exist!');
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
        throw errHandler.create400Error('the paramters are not defined!');
    }
    if (!Number.isInteger(number) || !Number.isInteger(offset))
    {
        throw errHandler.create400Error('the number or offset is not a integer!');
    }
    if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted"))
    {
        throw errHandler.create400Error('the orderBy is not valid!');
    }
    if (!(sort === "ASC" || sort === "DESC"))
    {
        throw errHandler.create400Error('the sort is not valid!');
    }

    let res = await papersDao.selectAll(number, offset, orderBy, sort);
    if (res.length === 0)
    {
        throw errHandler.create404Error('the list is empty!');
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
        throw errHandler.create400Error('the paramters are not defined!');
    }
    if (keyword === "")
    {
        throw errHandler.create400Error('the keyword is empty!');
    }
    if (!Number.isInteger(number) || !Number.isInteger(offset))
    {
        throw errHandler.create400Error('the number or offset is not a integer!');
    }
    if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted"))
    {
        throw errHandler.create400Error('the orderBy is not valid!');
    }
    if (!(sort === "ASC" || sort === "DESC"))
    {
        throw errHandler.create400Error('the sort is not valid!');
    }

    let res = await papersDao.selectBySingleKeyword(keyword, number, offset, orderBy, sort);
    if (res.length === 0)
    {
        throw errHandler.create404Error('the list is empty!');
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