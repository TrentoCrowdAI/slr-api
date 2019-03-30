// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
const errHandler = require(__base + 'utils/errors');
//supply the ausiliar function
const support = require(__base + 'utils/support');
//the packaged for input validation
const validationSchemes = require(__base + 'utils/validation.schemes');
const Ajv = require('ajv');
const ajv = new Ajv();
ajv.addKeyword('isNotEmpty', {//keyword for empty string
    type: 'string',
    validate: function (schema, data) {
      return typeof data === 'string' && data.trim() !== ''
    },
    errors: false
})
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
 * @param {integer}  project_id
 * @param {object} newProjectData
 
 */
async function update(project_id, newProjectData) {

    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }

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
 * @param {integer} project_id
 */
async function deletes(project_id) {

    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id  is not a integer!');
    }

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
 * @param {integer} project_id
 * @returns {object} project found
 */
async function selectById(project_id) {
    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id  is not a integer!');
    }

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
 * @param {integer} number number of projects
 * @param {integer} after the next one for the next page
 * @param {integer} before position where to begin to get backwards
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} list of projects 
 */
async function selectAll(number, after, before, orderBy, sort) {

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
    //set orderBy
    orderBy = orderBy || "id";
    //will return not empty string if they are not valid 
    let errorMessage = support.areValidPaginationParameters(number, after, before, orderBy, sort, "projects");
    if (errorMessage !== "")
    {
        throw errHandler.createBadRequestError(errorMessage);
    }

    //check DAO layer
    if(after === 0){after = -1}//if after has default value we put it to -1 we include the item with id 0 when starting
    let res = await projectsDao.selectAll(number, after, before, orderBy, sort);
    
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}


/**
 * 
 * select project by a single keyword
 * @param {string} keyword to search
 * @param {integer} number number of projects
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projects 
 */
async function selectBySingleKeyword(keyword, number, offset, orderBy, sort) {

    //cast number to integer type
    number = Number(number);
    //cast offset to integer type
    offset = Number(offset);

    //will return not empty string if they are not valid 
    let errorMessage = support.areValidListParameters(number, offset, orderBy, sort);
    if (errorMessage !== "")
    {
        throw errHandler.createBadRequestError(errorMessage);
    }
    //error check
    if (keyword === undefined || keyword === null)
    {
        throw errHandler.createBadRequestError('the keyword is not define!');
    }
    //error check
    if (keyword === "")
    {
        throw errHandler.createBadRequestError('the keyword is empty!');
    }

    //call DAO layer
    let res = await projectsDao.selectBySingleKeyword(keyword, number, offset, orderBy, sort);
    //error check
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