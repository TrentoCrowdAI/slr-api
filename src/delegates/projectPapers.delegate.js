// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
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
 * insert a list of projectPaper by copy from fake_paper table
 * @param {string} google_id of user
 * @param {array[]} arrayEid array of paper eid
 * @param {string} project_id
 * @returns {array[]} projectPaper created
 */
async function insertFromPaper(google_id, arrayEid, project_id) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);
    //check the validation of array
    errorCheck.isValidArray(arrayEid);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    let arrayEidExisting = await projectPapersDao.checkExistenceByEids(arrayEid, project_id);
    arrayEid = support.differenceOperation(arrayEid, arrayEidExisting);
    //call DAO layer
    let res = await projectPapersDao.insertFromPaper(arrayEid, project_id);

    //if at least one post is inserted
    if (arrayEid.length > 0) {
        //update the last modified date
        let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    }

    return res;
}


/**
 * insert a custom paper into a project
 * @param {string} google_id of user
 * @param {string} project_id
 * @param {object} newPaper
 * @returns {object} projectPaper created
 */
async function insertCustomPaper(google_id, project_id, newPaper) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaper);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data is not valid! (' + ajv.errorsText() + ')');
    }

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer
    let res = await projectPapersDao.insert(newPaper, project_id);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);

    return res;
}

/**
 *  * update a projectPaper
 * @param {string} google_id of user
 * @param {string} projectPaper_id
 * @param {object} newProjectPaperData
 */
async function update(google_id, projectPaper_id, newProjectPaperData) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new projectPaper data for update is not valid!');
    }

    //get project id by projectPaper id
    let projectPaper = await projectPapersDao.selectById(projectPaper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(projectPaper.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(projectPaper.project_id);

    //call DAO layer
    let numberRow = await projectPapersDao.update(projectPaper_id, newProjectPaperData);



}


/**
 *  * delete a projectPaper
 * @param {string} google_id of user
 * @param {string} projectPaper_id
 */
async function deletes(google_id, projectPaper_id) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

    //get project id by projectPaper id
    let projectPaper = await projectPapersDao.selectById(projectPaper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(projectPaper.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //update the last modified date
    let updateProjectDate = await projectsDao.updateLastModifiedDate(projectPaper.project_id);

    //call DAO layer
    let numberRow = await projectPapersDao.deletes(projectPaper_id);


}


/**
 * select a projectPaper
 * @param {string} projectPaper_id
 * @returns {object} projectPaper found
 *//*
 async function selectById(projectPaper_id)  {

 //check validation of projectPaper_id and transform the value in integer
 projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

 //call DAO layer
 let res = await projectPapersDao.selectById(projectPaper_id);

 //error check
 if (res === undefined)
 {
 throw errHandler.createNotFoundError('ProjectPaper does not exist!');
 }

 return res;
 }
 */

/**
 * select all projectPaper associated with a project
 * @param {string} google_id of user
 * @param {string} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 */
async function selectByProject(google_id, project_id, orderBy, sort, start, count) {

    //error check for google_id
    errorCheck.isValidGoogleId(google_id);

    //check the validation of parameters
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //get user info
    let user = await usersDao.getUserByGoogleId(google_id);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer
    let res = await projectPapersDao.selectByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}

/**
 * search papers belonging to a project
 * @param {string} google_id of user
 * @param {string} keyword to search
 * @param {string} project_id
 * @param {string} searchBy [all, author, content] "content" means title+description
 * @param {string} year specific year to search
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of papers
 * @returns {Object} array of projectPapers and total number of result
 *//*
async function searchPaperByProject(google_id, keyword, project_id, searchBy, year, orderBy, sort, start, count) {

    //check the validation of parameters
    errorCheck.isValidKeyword(keyword);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    /*=============
     temporary parameter
     * ============ *//*
    searchBy = searchBy || "all";
    if (searchBy !== "all" && searchBy !== "author" && searchBy !== "content") {
        throw errHandler.createBadRequestError('searchBy has a not valid value!');
    }
    year = Number(year) || "";
    if (year !== "" && !Number.isInteger(year)) {
        throw errHandler.createBadRequestError('year has a not valid value!');
    }

    /*================= *//*

    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);

    //call DAO layer
    let res = await projectPapersDao.searchPaperByProject(keyword, project_id, searchBy, year, orderBy, sort, start, count);
    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}*/


module.exports = {
    insertCustomPaper,
    insertFromPaper,
    update,
    deletes,
    //selectById,
    selectByProject,
    //searchPaperByProject
};