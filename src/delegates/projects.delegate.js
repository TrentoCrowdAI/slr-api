// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
const errorCheck = require(__base + 'utils/errorCheck');

//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');



/**
 * insert a project
 * @param {string} google_id of user
 * @param {object} newProjectData
 * @returns {object} project created
 */
async function insert(google_id, newProjectData ) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new project data is not valid!');
    }

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //add the user_id in project data
    newProjectData.user_id = user.id;

    //call DAO layer
    let res = await projectsDao.insert(newProjectData);

    return  res;
}


/**
 *  * update a project
 * @param {string} google_id of user
 * @param {string}  project_id
 * @param {object} newProjectData
 */
async function update(google_id, project_id, newProjectData) {

    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new project data for update is not valid!');
    }

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //add the user_id in project data
    newProjectData.user_id = user.id;

    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

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
 * @param {string} google_id of user
 * @param {string} project_id
 */
async function deletes(google_id, project_id ) {

    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);

    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

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
 * @param {string} google_id of user
 * @param {string} project_id
 * @returns {object} project found
 */
async function selectById(google_id, project_id ) {

    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    return project;
}

/**
 * 
 * select all project
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projects and total number of result
 *//*
async function selectAll(orderBy, sort, start, count) {

    //check the validation of parameters
    orderBy = errorCheck.setAndCheckValidProjectOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    let res = await projectsDao.selectAll(orderBy, sort, start, count);
    
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}
*/

/**
 * select all project of a specific user
 * @param {string} google_id of user
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectAllByUserId(google_id, orderBy, sort, start, count) {



    //check the validation of parameters
    orderBy = errorCheck.setAndCheckValidProjectOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //error check for google_id
    errorCheck.isValidGoogleId(google_id);
    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);

    let res = await projectsDao.selectAllByUserId(user.id, orderBy, sort, start, count);

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
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projects and total number of result
 *//*
async function selectBySingleKeyword(keyword, orderBy, sort, start, count) {


    //check the validation of parameters
    errorCheck.isValidKeyword(keyword);
    orderBy = errorCheck.setAndCheckValidProjectOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //call DAO layer
    let res = await projectsDao.selectBySingleKeyword(keyword, orderBy, sort, start, count);
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}*/






module.exports = {
    insert,
    update,
    deletes,
    selectById,
    //selectAll,
    selectAllByUserId,
    //selectBySingleKeyword,

};