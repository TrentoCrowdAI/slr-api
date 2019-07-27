// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');
const screeningsDao = require(__base + 'dao/screenings.dao');
const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const filtersDao = require(__base + 'dao/filters.dao');

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
//the function to send email to notify the sharing
const shareProjectMail = require(__base + 'utils/email/shareProjectMail');
const conn = require(__base + 'utils/conn');


/**
 * insert screener by array
 * @param {string} user_email of user
 * @param {int[]} array_screener_id
 * @param {string} manual_screening_type
 * @param {string} project_id

 * @returns {Object[]} list of screenings created
 */
async function insertByArray(user_email, array_screener_id, manual_screening_type, project_id,) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of array_screener_id
    errorCheck.isValidArrayInteger(array_screener_id);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //check validation of screening type
    if (manual_screening_type !== config.manual_screening_type.single_predicate && manual_screening_type !== config.manual_screening_type.multi_predicate) {
        throw errHandler.createBadRequestError("the manual_screening_type is not valid!");
    }


    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //final response array
    let finalRes = [];
    //for each screener id and screening data
    for (let i = 0; i < array_screener_id.length; i++) {

        //check existence of selected user
        let screenersUser = await usersDao.getUserById(array_screener_id[i]);
        if (!screenersUser) {
            throw errHandler.createBadRequestError("the selected user for screening isn't exist!");
        }
        if (!project.data.user_id.includes(array_screener_id[i].toString())) {
            throw errHandler.createBadRequestError("the selected user for screening must be a collaborator of this project!");
        }

        //check existence of screener in screenings table
        let screeningsRecord = await screeningsDao.selectByUserIdAndProjectId(array_screener_id[i], project_id);
        //if the selected user is already present in the screenings table

        if (screeningsRecord) {
            throw errHandler.createBadRequestError("the selected user for screening is already present in this project!");
        }

        //insert the screener in the screenings table
        let res = await screeningsDao.insert({"tags":[]}, array_screener_id[i], project_id);
        //save the res of current element
        finalRes.push(res);
    }

    //if screening type of project is not defined yet
    if (!project.data.manual_screening_type) {
        //set screening type of project
        project.data.manual_screening_type = manual_screening_type;
        await projectsDao.update(project.id, project.data);
    }

    return finalRes;

}


/**
 * delete a screener
 * @param {string} user_email of user
 * @param {string} screeners_id
 * @param {string} project_id
 * @returns {Object} project found
 */
async function deletes(user_email, screeners_id, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of screener's id and transform the value in integer
    screeners_id = errorCheck.setAndCheckValidScreenersId(screeners_id);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get relative project and check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);


    //check existence of screener in screenings table
    let screeningsRecord = await screeningsDao.selectByUserIdAndProjectId(screeners_id, project_id);
    //if the selected user isn't present in the screenings table
    if (!screeningsRecord) {
        throw errHandler.createBadRequestError("the selected user for screening isn't  present in this project!");
    }

    //delete the screener from the screenings table
    await screeningsDao.deleteByUserIdAndProjectId(screeners_id, project_id);


}


/**
 * get all screener by project id
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {Object} project found
 */
async function selectAllByProjectId(user_email, project_id) {

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


    let res = await screeningsDao.selectByProjectId(project_id);

    //empty error check
    if (res.length === 0) {
        throw errHandler.createNotFoundError('the list of screnner is empty!');
    }

    return res;

}

/**
 * internal function to help manage the auto screening service
 * @param {Object[]} projectPapers
 * @param {Float} threshold
 * @param {Object} queryData 
 */
async function manageAutoScreeningService(projectPapers, threshold, queryData) {
    console.log("waiting for fake eval")
    let response = await conn.post(config.automated_evaluation_server, queryData);

    //for each result
    for (let i = 0; i < response.length; i++) {
        //for each projectPaper
        for (let j = 0; j < projectPapers.length; j++) {

            //if key id is equal to projectPaper id
            if (response[i].id === projectPapers[j].id) {

                //if metadata filed is not defined
                if (!projectPapers[j].data.metadata) {
                    //create a new object
                    projectPapers[j].data.metadata = {};
                }
                //if automatedScreening filed is not defined
                if (!projectPapers[j].data.metadata.automatedScreening) {
                    //create a new object
                    projectPapers[j].data.metadata.automatedScreening = {};
                }

                //save the confidence value
                projectPapers[j].data.metadata.automatedScreening.value = response[i].value;
                //save the filter array
                projectPapers[j].data.metadata.automatedScreening.filters = response[i].filters;

                //if the confidence value is grater than threshold
                if (response[i].value >= threshold) {


                    //create a new screening object and set value
                    //set screening result as true
                    //set source of screening result as "automated screening"
                    projectPapers[j].data.metadata.screening = {
                        "result": 1,
                        "source": config.screening_source.automated_screening
                    };
                    //set screened status
                    projectPapers[j].data.metadata.screened = config.screening_status.screened;

                }

            }


        }

    }

    //for each projectPaper
    for (let j = 0; j < projectPapers.length; j++) {
        //update in the DB
        await projectPapersDao.update(projectPapers[j].id, projectPapers[j].data);
    }

}

/**
 * automated screening,
 * the function will evaluate all papers not evaluated, not voted, not screened.
 * Then, the papers with confidence value greater than threshold value, will be set as Screened
 * @param {string} user_email of user
 * @param {string} project_id
 * @param {string} threshold value of confidence
 * @returns {Object[]} projectPaper evaluated
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
    let projectPapers = await projectPapersDao.selectAllNotEvaluatedAndScreened(project_id);
    //call DAO layer
    let filters = await filtersDao.selectAllByProject(project_id);

    let queryData = {};
    queryData.arrayPaper = projectPapers;
    queryData.arrayFilter = filters;

    //after everything is set up, I let a function handle call & response of external service
    manageAutoScreeningService(projectPapers, threshold, queryData);


}


/**
 * get automated screening status (in percentage)
 * now it only return a random number
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {int} progress in percentage
 */
async function getAutomatedScreeningStatus(user_email, project_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get number of autoScreened papers and totalPaper
    let statusData = await projectPapersDao.countAutoScreenedOutOfTotalPapers(project_id);

    //calculate the random value
    let statusPercentage = Math.floor(statusData.totalAutoScreened/statusData.totalResults * 100);

    return statusPercentage;

}


/**
 * select the project of a specific screening user
 * @param {string} user_email of user
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {string} start offset position where we begin to get
 * @param {string} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectByScreeningUser(user_email, orderBy, sort, start, count) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check the validation of parameters
    orderBy = errorCheck.setAndCheckValidProjectOrderBy(orderBy);
    sort = errorCheck.setAndCheckValidSort(sort);
    start = errorCheck.setAndCheckValidStart(start);
    count = errorCheck.setAndCheckValidCount(count);


    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    let res = await projectsDao.selectByScreeningUser(user.id, orderBy, sort, start, count);

    //error check
    if (res.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    return res;
}

/**
 * get  a last paper to vote from a specific project
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {Object} projectPaper found
 */
async function selectOneNotVotedByUserIdAndProjectId(user_email, project_id) {

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
    let res = await projectPapersDao.selectOneNotVotedByUserIdAndProjectId(user.id, project_id);

    //if there isn't the projectPaper to vote
    if (!res) {
        throw errHandler.createNotFoundError('not voted ProjectPaper does not exist!');
    }

    return res;
}


module.exports = {
    insertByArray,
    deletes,
    selectAllByProjectId,
    automatedScreening,
    getAutomatedScreeningStatus,
    selectByScreeningUser,
    selectOneNotVotedByUserIdAndProjectId

};