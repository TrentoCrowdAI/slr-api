// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');
const screeningsDao = require(__base + 'dao/screenings.dao');
const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const filtersDao = require(__base + 'dao/filters.dao');
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
        let res = await screeningsDao.insert({

            "manual_screening_type": manual_screening_type
        }, array_screener_id[i], project_id);
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
 * insert screener after starting manual screening
 * @param {string} user_email of user
 * @param {string} screeners_id
 * @param {string} project_id

 * @returns {Object[]} list of screenings created
 */
async function insert(user_email, screeners_id, project_id,) {

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
    //if the manual screening precess isn't not start yet
    if(!project.data.manual_screening_type){
        throw errHandler.createBadRequestError("the project is not yet initialized for manual screening!");
    }


    //check existence of selected user
    let screenersUser = await usersDao.getUserById(screeners_id);
    if (!screenersUser) {
        throw errHandler.createBadRequestError("the selected user for screening isn't exist!");
    }
    if (!project.data.user_id.includes(screeners_id.toString())) {
        throw errHandler.createBadRequestError("the selected user for screening must be a collaborator of this project!");
    }

    //check existence of screener in screenings table
    let screeningsRecord = await screeningsDao.selectByUserIdAndProjectId(screeners_id, project_id);
    //if the selected user is already present in the screenings table
    if (screeningsRecord) {
        throw errHandler.createBadRequestError("the selected user for screening is already present in this project!");
    }

    //insert the screener in the screenings table
    let res = await screeningsDao.insert({

        "manual_screening_type": project.data.manual_screening_type
    }, screeners_id, project_id);

    /* ==================================================
     update the paper screening status after adding this screener
     ==================================================*/

    //get all papers id of this project
    let projectPapers = await projectPapersDao.selectAllByProjectId(project_id);
    //get number of screeners
    let numberScreeners = await screeningsDao.countByProject(project_id);

    let votes;


    //for each paper
    for (let i = 0; i < projectPapers.length; i++) {

        //get the votes of this paper
        votes = await votesDao.selectByProjectPaperId(projectPapers[i].id);

        //if is a paper is screened
        if (projectPapers[i].data.metadata && projectPapers[i].data.metadata.screened === config.screening_status.screened) {
            //if votes's number  is equal to (the number of screeners -1 )
            if (votes.length === (parseInt(numberScreeners)-1) ) {

                //delete screening property
                delete projectPapers[i].data.metadata.screening;

                //set the projectPaper screened status of projectPaper as manual
                projectPapers[i].data.metadata.screened = config.screening_status.manual;

                //update the projectPaper Object
                await projectPapersDao.update(projectPapers[i].id, projectPapers[i].data);

            }
        }
    }

    return res;

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

    //delete all votes of this screener on this project
    await votesDao.deleteByProjectIdAndUserId(project_id, user.id);

    /* ==================================================
     update the paper screening status without this screener
     ==================================================*/

    //get all papers id of this project
    let projectPapers = await projectPapersDao.selectAllByProjectId(project_id);
    //get number of screeners
    let numberScreeners = await screeningsDao.countByProject(project_id);

    let votes;
    let positiveNumber;
    let negativeNumber;

    //for each paper
    for (let i = 0; i < projectPapers.length; i++) {

        //get the votes of this paper
        votes = await votesDao.selectByProjectPaperId(projectPapers[i].id);

        //if is a paper has some votes, but not all
        if (projectPapers[i].data.metadata && projectPapers[i].data.metadata.screened === config.screening_status.manual) {
            //if votes's number  is equal to the number of screeners
            if (votes.length === parseInt(numberScreeners)) {

                //start screened paper
                positiveNumber = 0;
                negativeNumber = 0;
                //for each vote
                for (let i = 0; i < votes.length; i++) {
                    //count their negative cases and positive cases
                    if (votes[i].data.answer === "0") {
                        negativeNumber++;
                    } else if (votes[i].data.answer === "1") {
                        positiveNumber++;
                    }
                }

                //create a object for screening
                //set screening source
                //set screening result, 0 (false) for default
                projectPapers[i].data.metadata.screening = {
                    source: config.screening_source.manual_screening,
                    result: "0"
                };
                //if positive cases is greater or equal than negative cases
                if (positiveNumber >= negativeNumber) {
                    projectPapers[i].data.metadata.screening.result = "1";
                }

                //set the projectPaper screened status of projectPaper as screened
                projectPapers[i].data.metadata.screened = config.screening_status.screened;

                //update the projectPaper Object
                await projectPapersDao.update(projectPapers[i].id, projectPapers[i].data);

            }
        }
    }


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
 * @param {number} threshold
 * @param {Object} queryData
 */
async function manageAutoScreeningService(projectPapers, threshold, queryData) {
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
    queryData.project_id = project_id;

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

    let response = await conn.get(config.automated_evaluation_server, {"project_id": project_id});

    return response;

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
 * select a screening
 * @param {string} user_email of user
 * @param {string} screening_id
 * @returns {Object} screening found
 */
async function selectById(user_email, screening_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of screening id and transform the value in integer
    screening_id = errorCheck.setAndCheckValidScreeningId(screening_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get screening info
    let screening = await screeningsDao.selectById(screening_id);

    //if screening doesn't exists
    if (screening === undefined) {
        throw errHandler.createNotFoundError("the screening doesn't exists");
    }

    //if user is not assigned to the selected screening I throw an error
    if (user.id !== screening.user_id) {
        throw errHandler.createUnauthorizedError("unauthorized operation");
    }

    //I get the project in order to check if the user is still a collaborator
    let project = await projectsDao.selectByIdAndUserId(screening.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //if project's tags isn't defined, it will replace by empty string
    let projectTags = project.data.tags || "";
    //I also add the title of the screening to be the same as the project title
    //the old data filed will be replace by new data filed with property "name" and property "tags"
    let screeningData = {...screening, data: {...(screening.data), "name": project.data.name, "tags": projectTags}};

    return screeningData;
}

/**
 * get  a last paper to vote from a specific screening
 * @param {string} user_email of user
 * @param {string} screening_id
 * @returns {Object} projectPaper found
 */
async function selectOneNotVotedByUserIdAndProjectId(user_email, screening_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of screening id and transform the value in integer
    screening_id = errorCheck.setAndCheckValidScreeningId(screening_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);

    //get screening info
    let screening = await screeningsDao.selectById(screening_id);

    //if user is not assigned to the selected screening I throw an error
    if (user.id !== screening.user_id) {
        throw errHandler.createUnauthorizedError("unauthorized operation");
    }

    //I get the project in order to check if the user is still a collaborator
    let project = await projectsDao.selectByIdAndUserId(screening.project_id, user.id);

    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);


    //call DAO layer
    let res = await projectPapersDao.selectOneNotVotedByUserIdAndProjectId(user.id, screening.project_id);

    //if there isn't the projectPaper to vote
    if (!res) {
        throw errHandler.createNotFoundError('not voted ProjectPaper does not exist!');
    }

    return res;
}


module.exports = {
    insertByArray,
    insert,
    deletes,
    selectById,
    selectAllByProjectId,
    automatedScreening,
    getAutomatedScreeningStatus,
    selectByScreeningUser,
    selectOneNotVotedByUserIdAndProjectId

};