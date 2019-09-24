// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const filtersDao = require(__base + 'dao/filters.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * insert a filter into a project
 * @param {string} user_email of user
 * @param {Object} newFilterData
 * @returns {Object} filter created
 */
async function insert(user_email, newFilterData, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.filter, newFilterData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new filter data is not valid! (' + ajv.errorsText() + ')');
    }


    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer to get number of filters
    let nFilters = await filtersDao.countByProject(project_id);
    let newNumberForFilters = parseInt(nFilters) + 1;
    //set name of filter
    newFilterData.name = "C" + newNumberForFilters;

    //call DAO layer to insert the filter data
    let res = await filtersDao.insert(newFilterData, project_id);

    //update the last modified date
    await projectsDao.updateLastModifiedDate(project_id);

    return res;
}

/**
 *  * update a filter, the project_id will not be change
 * @param {string} user_email of user
 * @param {string} filter_id

 * @param {Object} newFilterData
 */
async function update(user_email, filter_id, newFilterData) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of filter_id and transform the value in integer
    filter_id = errorCheck.setAndCheckValidFilterId(filter_id);


    //check input format
    let valid = ajv.validate(validationSchemes.filter, newFilterData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new filter data for update is not valid!');
    }

    //get filter object by filter id
    let filter = await filtersDao.selectById(filter_id);
    errorCheck.isValidFilter(filter);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(filter.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //update the last modified date
    await projectsDao.updateLastModifiedDate(filter.project_id);

    //call DAO layer
    //copy the name of filter
    newFilterData.name = filter.data.name;
    await filtersDao.update(filter_id, newFilterData);


}


/**
 *  * delete a filter
 * @param {string} user_email of user
 * @param {string} filter_id
 */
async function deletes(user_email, filter_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of filter_id and transform the value in integer
    filter_id = errorCheck.setAndCheckValidFilterId(filter_id);

    //get filter object by filter id
    let filter = await filtersDao.selectById(filter_id);
    errorCheck.isValidFilter(filter);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(filter.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(filter.project_id);

    //call DAO layer
    let numberRow = await filtersDao.deletes(filter_id);


}


/**
 * select a filter
 * @param {string} user_email of user
 * @param {string} filter_id
 * @returns {Object} filter found
 */
async function selectById(user_email, filter_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of filter_id and transform the value in integer
    filter_id = errorCheck.setAndCheckValidFilterId(filter_id);

    //get filter object by filter id
    let filter = await filtersDao.selectById(filter_id);
    errorCheck.isValidFilter(filter);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(filter.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    return filter;
}


/**
 * select all filter associated with a project
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} orderBy
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of filters and total number of result
 */
async function selectByProject(user_email, project_id, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check the validation of parameters
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer
    let res = await filtersDao.selectByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list of filters is empty!');
    }

    return res;
}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectByProject,

};