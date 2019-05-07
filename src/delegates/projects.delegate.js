// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');



/**
 * insert a project
 * @param {object} newProjectData
 * @returns {object} project created
 */
async function insert(newProjectData) {
    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new project data is not valid!');
    }

    //call DAO layer
    let res = await projectsDao.insert(newProjectData);

    return  res;
}


/**
 *  * update a project
 * @param {int}  project_id
 * @param {object} newProjectData
 */
async function update(project_id, newProjectData) {

    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new project data for update is not valid!');
    }

    //call DAO layer
    let numberRow = await projectsDao.update(project_id, newProjectData);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Project does not exist!');
    }

}


/**
 *  * delete a project
 * @param {int} project_id
 */
async function deletes(project_id) {

    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    //call DAO layer
    let numberRow = await projectsDao.deletes(project_id);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('Project does not exist!');
    }
}


/**
 * select a project
 * @param {int} project_id
 * @returns {object} project found
 */
async function selectById(project_id) {

    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    //call DAO layer
    let res = await projectsDao.selectById(project_id);
    //error check
    if (res === undefined)
    {
        throw errHandler.createNotFoundError('Project does not exist!');
    }
    return res;
}

/**
 * 
 * select all project
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted}
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectAll(orderBy, sort, start, count) {

    //check the validation of parameters
    orderBy = support.setAndCheckValidProjectOrderBy(orderBy);
    sort = support.setAndCheckValidSort(sort);
    start = support.setAndCheckValidStart(start);
    count = support.setAndCheckValidCount(count);

    let res = await projectsDao.selectAll(orderBy, sort, start, count);
    
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}


/**
 * select project by a single keyword
 * @param {string} keyword to search
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted}
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectBySingleKeyword(keyword, orderBy, sort, start, count) {


    //check the validation of parameters
    support.isValidKeyword(keyword);
    orderBy = support.setAndCheckValidProjectOrderBy(orderBy);
    sort = support.setAndCheckValidSort(sort);
    start = support.setAndCheckValidStart(start);
    count = support.setAndCheckValidCount(count);

    //call DAO layer
    let res = await projectsDao.selectBySingleKeyword(keyword, orderBy, sort, start, count);
    //error check
    if (res.results.length === 0)
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
    selectBySingleKeyword,

};