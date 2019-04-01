// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const errHandler = require(__base + 'utils/errors');
//supply the ausiliar function
const support = require(__base + 'utils/support');
//the packaged for input validation
const validationSchemes = require(__base + 'utils/validation.schemes');
const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * insert a projectPaper by copie from fake_paper table
 * @param {integer} paper_id
 * @param {integer} project_id
 * @param {object} newProjectPaperData
 * @returns {object} projectPaper created
 */
async function insertFromPaper(paper_id, project_id) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
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
    let paper = await projectPapersDao.selectByIdAndProjectId(paper_id, project_id); 
    if(paper){
        throw errHandler.createBadRequestError('The selected paper is already in the project');
    }
    //call DAO layer
    let res = await projectPapersDao.insertFromPaper(paper_id, project_id);
    return  res;
}


/**
 *  * update a projectPaper
 * @param {integer} projectPaper_id
 * @param {object} newProjectPaperData
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function update(projectPaper_id, newProjectPaperData) {
    //error check
    if (projectPaper_id === undefined || projectPaper_id === null)
    {
        throw errHandler.createBadRequestError('Project paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    projectPaper_id = Number(projectPaper_id);
    //error check
    if (!Number.isInteger(projectPaper_id))
    {
        throw errHandler.createBadRequestError('Project paper id  is not a integer!');
    }
    
    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new projectPaper data for update is not valid!');
    }
    //call DAO layer
    let numberRow = await projectPapersDao.update(projectPaper_id, newProjectPaperData);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }

}


/**
 *  * delete a projectPaper
 * @param {integer} projectPaper_id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(projectPaper_id) {
    //error check
    if (projectPaper_id === undefined || projectPaper_id === null)
    {
        throw errHandler.createBadRequestError('Project paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    projectPaper_id = Number(projectPaper_id);
    //error check
    if (!Number.isInteger(projectPaper_id))
    {
        throw errHandler.createBadRequestError('Project paper id  is not a integer!');
    }
    
    //call DAO layer
    let numberRow = await projectPapersDao.deletes(projectPaper_id);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
}


/**
 * select a projectPaper
 * @param {integer} projectPaper_id
 * @returns {object} projectPaper found
 */
async function selectById(projectPaper_id)  {
    //error check
    if (projectPaper_id === undefined || projectPaper_id === null)
    {
        throw errHandler.createBadRequestError('Project paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    projectPaper_id = Number(projectPaper_id);
    //error check
    if (!Number.isInteger(projectPaper_id))
    {
        throw errHandler.createBadRequestError('Project paper id  is not a integer!');
    }

    
    //call DAO layer
    let res = await projectPapersDao.selectById(projectPaper_id);
    //error check
    if (res === undefined)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
    return res;
}

/**
 * select all projectPaper associated with a project
 * @param {integer} project_id
 * @param {integer} number number of projectPapers
 * @param {integer} after id where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projectPapers 
 */
async function selectByProject(project_id, number, after, before, orderBy, sort) {

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

    //will return not empty string if they are not valid 
    let errorMessage = support.areValidPaginationParameters(number, after, before, orderBy, sort, "projectPapers");
    if (errorMessage !== "")
    {
        throw errHandler.createBadRequestError(errorMessage);
    }

    //call DAO layer
    let res = await projectPapersDao.selectByProject(project_id, number, after, before, orderBy, sort);
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}

/**
 * search papers associated with a project
 * @param {string} keyword
 * @param {integer} project_id
 * @param {integer} number number of projectPapers
 * @param {integer} after id where we begin to get
 * @param {integer} before id where we begin to get backwards
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projectPapers 
 */
async function searchPaperByProject(keyword, project_id, number, after, before, orderBy, sort) {

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

    //will return not empty string if they are not valid 
    let errorMessage = support.areValidPaginationParameters(number, after, before, orderBy, sort, "projectPapers");
    if (errorMessage !== "")
    {
        throw errHandler.createBadRequestError(errorMessage);
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
    let res = await projectPapersDao.searchPaperByProject(keyword, project_id, number, after, before, orderBy, sort);
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}


module.exports = {
    insertFromPaper,
    update,
    deletes,
    selectById,
    selectByProject,
    searchPaperByProject
};