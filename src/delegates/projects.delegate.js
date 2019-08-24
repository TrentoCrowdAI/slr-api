// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');
//the function to send email to notify the sharing
const shareProjectMail = require(__base + 'utils/email/shareProjectMail');


/**
 * insert a project
 * @param {string} user_email of user
 * @param {Object} newProjectData
 * @returns {Object} project created
 */
async function insert(user_email, newProjectData) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new project data is not valid!');
    }

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //add the user_id in project data
    newProjectData.user_id = [user.id];

    //call DAO layer
    let res = await projectsDao.insert(newProjectData);

    return res;
}


/**
 *  * update project name and description
 * @param {string} user_email of user
 * @param {string}  project_id
 * @param {Object} newProjectData where cotains the new name and description
 */
async function updateNameAndDescription(user_email, project_id, newProjectData) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.project, newProjectData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new project data for update is not valid!');
    }

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //update name and description of project
    project.data.name = newProjectData.name;
    project.data.description = newProjectData.description;

    //call DAO layer
    let numberRow = await projectsDao.update(project_id, project.data);

}


/**
 *  * delete a project
 * @param {string} user_email of user
 * @param {string} project_id
 */
async function deletes(user_email, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer
    let numberRow = await projectsDao.deletes(project_id);

}


/**
 * select a project
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {Object} project found
 */
async function selectById(user_email, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

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
 * select the project of a specific user
 * @param {string} user_email of user
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectByUserId(user_email, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check the validation of parameters
    orderBy = errorCheck.setAndCheckValidProjectOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    let res = await projectsDao.selectByUserId(user.id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
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


/**
 * share the project with other user
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} collaborator_email
 * @returns {Object} project found
 */
async function shareProject(user_email, project_id, collaborator_email) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //error check for shared user's email
    errorCheck.isValidGoogleEmail(collaborator_email);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //check existence of  shared user
    let sharedUser = await usersDao.getUserByEmail(collaborator_email);
    if (!sharedUser) {
        //create a new user object and insert it in DB
        sharedUser = await usersDao.insert({email: collaborator_email, name: "", picture: ""});
    }


    //if the shared user is already present in this project
    if (project.data.user_id.includes(sharedUser.id)) {
        throw errHandler.createBadRequestError("the shared user is already present in this project!");
    }

    //convert id to string and push it into the array
    project.data.user_id.push(sharedUser.id + "");
    //update the project
    await projectsDao.update(project.id, project.data);
    //send email notification
    await shareProjectMail(collaborator_email, user, project);


    return sharedUser;

}

/**
 * delete a sharing of the project
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} collaborator_id
 * @returns {Object} project found
 */
async function deleteShareProject(user_email, project_id, collaborator_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //check validation of collaborator_id
    errorCheck.isValidCollaboratorId(collaborator_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //if the shared user isn't present in this project
    if (!project.data.user_id.includes(collaborator_id.toString())) {
        throw errHandler.createBadRequestError("the user isn't present in this project!");
    }

    //remove the shared user id from array of user of this project
    project.data.user_id = support.removeElementFromArray(project.data.user_id, collaborator_id + "");
    //update the project
    await projectsDao.update(project.id, project.data);


}








module.exports = {
    insert,
    updateNameAndDescription,
    deletes,
    selectById,
    //selectAll,
    selectByUserId,
    shareProject,
    deleteShareProject,



};