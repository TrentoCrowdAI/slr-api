// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const projectsDao = require(__base + 'dao/projects.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * insert a list of projectPaper by copy from fake_paper table
 * @param {array[]} arrayEid array of paper eid
 * @param {number} project_id
 * @returns {array[]} projectPaper created
 */
async function insertFromPaper(arrayEid, project_id) {

    //check the validation of array
    support.isValidArray(arrayEid);
    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    let arrayEidExisting = await  projectPapersDao.checkExistenceByEids(arrayEid, project_id);
    arrayEid = support.differenceOperation(arrayEid, arrayEidExisting);
    //call DAO layer
    let res = await projectPapersDao.insertFromPaper(arrayEid, project_id);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    //error check
    if (updateProjectDate === 0)
    {
        throw errHandler.createNotFoundError('the project doesn\'t exist!');
    }

    return  res;
}


/**
 * insert a custom paper into a project
 * @param {object} newPaper
 * @param {number} project_id
 * @returns {object} projectPaper created
 */
async function insertCustomPaper(newPaper, project_id) {

    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaper);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data is not valid! (' + ajv.errorsText() + ')');
    }

    //call DAO layer
    let res = await projectPapersDao.insert(newPaper, project_id);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    //error check
    if (updateProjectDate === 0)
    {
        throw errHandler.createNotFoundError('the project doesn\'t exist!');
    }

    return  res;
}

/**
 *  * update a projectPaper
 * @param {number} projectPaper_id
 * @param {object} newProjectPaperData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(projectPaper_id, newProjectPaperData) {

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = support.setAndCheckValidProjectPaperId(projectPaper_id);

    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new projectPaper data for update is not valid!');
    }

    //get project id by projectPaper id
    let project_id = await projectPapersDao.getProjectIdByProjectPaperId(projectPaper_id);
    if(project_id === -1){
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    //error check
    if (updateProjectDate === 0)
    {
        throw errHandler.createNotFoundError('the project doesn\'t exist!');
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
 * @param {number} projectPaper_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(projectPaper_id) {

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = support.setAndCheckValidProjectPaperId(projectPaper_id);

    //get project id by projectPaper id
    let project_id = await projectPapersDao.getProjectIdByProjectPaperId(projectPaper_id);
    if(project_id === -1){
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    //error check
    if (updateProjectDate === 0)
    {
        throw errHandler.createNotFoundError('the project doesn\'t exist!');
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
 * @param {int} projectPaper_id
 * @returns {object} projectPaper found
 */
async function selectById(projectPaper_id)  {

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = support.setAndCheckValidProjectPaperId(projectPaper_id);

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
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 */
async function selectByProject(project_id, orderBy, sort, start, count) {

    //check the validation of parameters
    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);
    orderBy = support.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = support.setAndCheckValidSort(sort);
    start = support.setAndCheckValidStart(start);
    count = support.setAndCheckValidCount(count);

    //call DAO layer
    let res = await projectPapersDao.selectByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}

/**
 * search papers belonging to a project
 * @param {string} keyword to search
 * @param {int} project_id
 * @param {string} searchBy [all, author, content] "content" means title+description
 * @param year specific year to search
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of papers
 * @returns {Object} array of projectPapers and total number of result
 */
async function searchPaperByProject(keyword, project_id, searchBy, year, orderBy, sort, start, count) {

    //check the validation of parameters
    support.isValidKeyword(keyword);
    //check validation of project id and transform the value in integer
    project_id = support.setAndCheckValidProjectId(project_id);

    /*=============
     temporary parameter
    * ============ */
    searchBy = searchBy || "all";
    if (searchBy !== "all" && searchBy !== "author" && searchBy !== "content") {
        throw errHandler.createBadRequestError('searchBy has a not valid value!');
    }
    year = Number(year) || "";
    if(year !== "" && !Number.isInteger(year)){
        throw errHandler.createBadRequestError('year has a not valid value!');
    }

    /*================= */

    orderBy = support.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = support.setAndCheckValidSort(sort);
    start = support.setAndCheckValidStart(start);
    count = support.setAndCheckValidCount(count);

    //call DAO layer
    let res = await projectPapersDao.searchPaperByProject(keyword, project_id, searchBy, year, orderBy, sort, start, count);
    //error check
    if (res.results.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}


module.exports = {
    insertCustomPaper,
    insertFromPaper,
    update,
    deletes,
    selectById,
    selectByProject,
    searchPaperByProject
};