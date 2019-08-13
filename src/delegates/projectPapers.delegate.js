// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');
const votesDao = require(__base + 'dao/votes.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//the config file
const config = require(__base + 'config');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * insert a list of projectPaper by copy from fake_paper table
 * @param {string} user_email of user
 * @param {Object[]} arrayEid array of paper eid
 * @param {string} project_id
 * @returns {Object[]} projectPaper created
 */
async function insertFromPaper(user_email, arrayEid, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check the validation of array
    errorCheck.isValidArray(arrayEid, false);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //get array of eids where they are already presented in DB
    let arrayEidExisting = await projectPapersDao.checkExistenceByEids(arrayEid, project_id);

    //remove the eids already exist in DB
    arrayEid = support.differenceOperation(arrayEid, arrayEidExisting);

    //initial res with a empty array
    let res = [];

    //if at least one post will be inserted
    if (arrayEid.length > 0) {

        //call DAO layer
        res = await projectPapersDao.insertFromPaper(arrayEid, project_id);

        //update the last modified date of project
        let updateProjectDate = await projectsDao.updateLastModifiedDate(project_id);
    }


    return res;
}


/**
 * insert a custom paper into a project
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {Object} newPaper
 * @returns {Object} projectPaper created
 */
async function insertCustomPaper(user_email, project_id, newPaper) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check input format
    let valid = ajv.validate(validationSchemes.paper, newPaper);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new paper data is not valid! (' + ajv.errorsText() + ')');
    }

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
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
 * @param {string} user_email of user
 * @param {string} projectPaper_id
 * @param {Object} newProjectPaperData
 */
async function update(user_email, projectPaper_id, newProjectPaperData) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new projectPaper data for update is not valid!');
    }

    //get projectPaper object by projectPaper id
    let projectPaper = await projectPapersDao.selectById(projectPaper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
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
 * @param {string} user_email of user
 * @param {string} projectPaper_id
 */
async function deletes(user_email, projectPaper_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

    //get projectPaper object by projectPaper id
    let projectPaper = await projectPapersDao.selectById(projectPaper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
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
 * @returns {Object} projectPaper found
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
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} type screened status of paper
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @param {string} min_confidence minimum confidence value of post
 * @param {string} max_confidence maximum confidence value of post
 * @returns {Object} array of projectPapers and total number of result
 */
async function selectByProject(user_email, project_id, type, orderBy, sort, start, count, min_confidence, max_confidence) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check the validation of parameters
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check validation of parameters and set default value if is empty
    type = errorCheck.setAndCheckValidProjectPaperType(type);
    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    if (type === config.screening_status.backlog) {
        //check and set the confidence value
        min_confidence = errorCheck.setAndCheckValidMinConfidenceValue(min_confidence);
        max_confidence = errorCheck.setAndCheckValidMaxConfidenceValue(max_confidence);

        if (max_confidence < min_confidence) {
            throw errHandler.createBadRequestError('the max_confidence cannot be less than min_confidence!');
        }
    }

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //call DAO layer
    let res;
    switch (type) {
        case config.screening_status.all:
            res = await projectPapersDao.selectByProject(project_id, orderBy, sort, start, count);
            break;
        case config.screening_status.backlog:
            res = await projectPapersDao.selectNotScreenedByProject(project_id, orderBy, sort, start, count, min_confidence, max_confidence );
            break;
        case config.screening_status.manual:


            res = await projectPapersDao.selectManualByProject(project_id, orderBy, sort, start, count);
            for(let i = 0; i < res.results.length; i++){

                let allVotes = await votesDao.selectByProjectPaperId(res.results[i].id);

                res.results[i].data.metadata.votes = [];
                for(let j = 0; j < allVotes.length; j++){

                    let userx = await usersDao.getUserById(allVotes[j].user_id);
                    res.results[i].data.metadata.votes.push({user: {name: userx.data.name, picture: userx.data.picture}, answer: allVotes[j].data.answer});
                
                }

            }
            break;
        case config.screening_status.screened:
            res = await projectPapersDao.selectScreenedByProject(project_id, orderBy, sort, start, count);
            break;
    }


    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}


module.exports = {
    insertCustomPaper,
    insertFromPaper,
    update,
    deletes,
    //selectById,
    selectByProject,

};