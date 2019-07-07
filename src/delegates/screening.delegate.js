// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const filtersDao = require(__base + 'dao/filters.dao');
const usersDao = require(__base + 'dao/users.dao');
const votesDao = require(__base + 'dao/votes.dao');

//the config file
const config = require(__base + 'config');
//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
const conn = require(__base + 'utils/conn');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * automated screening,
 * the function will evaluate all papers not evaluated, not voted, not screened.
 * than screened the papers with confidence value greater than threshold value
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} threshold value of confidence
 * @returns {array[]} projectPaper evaluated
 */
async function automatedScreening(user_email, project_id, threshold) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    //check validation of threshold value
    threshold = errorCheck.setAndCheckValidThresholdValue(threshold);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //get all projectPapers
    let projectPapers = await projectPapersDao.selectAllNotEvaluatedNotScreenedNotVotedByProject(project_id);
    //call DAO layer
    let filters = await filtersDao.selectAllByProject(project_id);

    let queryData = {};
    queryData.arrayPaper = projectPapers;
    queryData.arrayFilter = filters.results;

    let response = await conn.post(config.automated_evaluation_server, queryData);

    //for each result
    for (let paper_id of Object.keys(response)) {
        //for each projectPaper
        for (let i = 0; i < projectPapers.length; i++) {

            //if key id is equal to projectPaper id
            if (paper_id === projectPapers[i].id) {

                //if metadata filed is not defined
                if (!projectPapers[i].data.metadata) {
                    //create a new object
                    projectPapers[i].data.metadata = {};
                }
                //if automatedScreening filed is not defined
                if (!projectPapers[i].data.metadata.automatedScreening) {
                    //create a new object
                    projectPapers[i].data.metadata.automatedScreening = {};
                }

                //save the confidence value
                projectPapers[i].data.metadata.automatedScreening.value = response[paper_id].value;
                //save the filter array
                projectPapers[i].data.metadata.automatedScreening.filter = response[paper_id].filters;

                //if the confidence value is grater than threshold
                if (response[paper_id].value >= threshold) {

                    //if screening filed is not defined
                    if (!projectPapers[i].data.metadata.screening) {
                        //create a new object
                        projectPapers[i].data.metadata.screening = {};
                    }
                    //set screening result as true
                    projectPapers[i].data.metadata.screening.result = 1;
                    //set source of screening result as "automated screening"
                    projectPapers[i].data.metadata.screening.source = config.screening_source.automated_screening;

                }

            }


        }

    }

    //for each projectPaper
    for(let j=0; j<projectPapers.length; j++){
        //update in the DB
        await projectPapersDao.update(projectPapers[j].id, projectPapers[j].data);
    }


}


/**
 * select the projectPapers in the back log (the papers that haven't screening result and vote)

 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {array[]} projectPaper evaluated
 */
async function selectFromBackLogByProjectId(user_email, project_id, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //get all projectPapers
    let res = await projectPapersDao.selectNotScreenedNotVotedByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}

/**
 * select the projectPapers in the manual page (the papers that have vote)

 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {array[]} projectPaper evaluated
 */
async function selectFromManualByProjectId(user_email, project_id, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);
    if(!project.data.screeners_id || !project.data.screeners_id.includes(user.id)){
        throw errHandler.createBadRequestError("the user isn't a screeners of this project!");
    }

    //get all projectPapers
    let res = await projectPapersDao.selectVotedNotScreenedByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}


/**
 * select the projectPapers in the screened page (the papers screened)

 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {array[]} projectPaper evaluated
 */
async function selectFromScreenedByProjectId(user_email, project_id, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);
    orderBy = errorCheck.setAndCheckValidProjectPaperOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);


    //get all projectPapers
    let res = await projectPapersDao.selectScreenedByProject(project_id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}


module.exports = {
    automatedScreening,
    selectFromBackLogByProjectId,
    selectFromManualByProjectId,
    selectFromScreenedByProjectId,


};