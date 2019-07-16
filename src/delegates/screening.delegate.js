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
    let projectPapers = await projectPapersDao.selectAllNotEvaluatedAndScreened(project_id);
    //call DAO layer
    let filters = await filtersDao.selectAllByProject(project_id);

    let queryData = {};
    queryData.arrayPaper = projectPapers;
    queryData.arrayFilter = filters;

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


                    //create a new screening object and set value
                    //set screening result as true
                    //set source of screening result as "automated screening"
                    projectPapers[i].data.metadata.screening = {
                        "result": 1,
                        "source": config.screening_source.automated_screening
                    };
                    //set screened status
                    projectPapers[i].data.metadata.screened = config.screening_status.screened;

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
    let res = await projectPapersDao.selectNotScreenedByProject(project_id, orderBy, sort, start, count);

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
    if (!project.data.screeners_id || !project.data.screeners_id.includes(user.id)) {
        throw errHandler.createBadRequestError("the user isn't a screeners of this project!");
    }

    //get all projectPapers that have the votes and not screened
    let projectPapers = await projectPapersDao.selectManualByProject(project_id, orderBy, sort, start, count);


    //error check on empty results
    if (projectPapers.results.length === 0) {
        throw errHandler.createNotFoundError('the list is empty!');
    }

    let votes;
    //for each paper
    for (let i = 0; i < projectPapers.length; i++) {
        //get relative vote object list
        votes = await votesDao.selectByProjectPaperId(projectPapers[i].id);
        //create a array to storage votes
        projectPapers.data.vote = [];

        //for each vote object associate with project
        for (let j = 0; j < votes.length; j++) {
            //save its id and answer
            projectPapers.data.vote.push({"id": votes[j].user_id, "answer": votes[j].data.answer});

        }
    }


    return projectPapers;
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


/**
 * insert the vote of a exist projectPaper
 * if all vote is inserted, screene the paper by average of answer in votes
 * @param {string} user_email of user
 * @param {string} projectPaper_id
 * @param {string} answer
 * @returns {Object} vote created
 */
async function insertVote(user_email, projectPaper_id, answer) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of projectPaper_id and transform the value in integer
    projectPaper_id = errorCheck.setAndCheckValidProjectPaperId(projectPaper_id);

    //check validation of answer
    if (answer !== "0" && answer !== "1") {
        throw errHandler.createBadRequestError("the answer isn't valide!");
    }

    //get projectPaper object by projectPaper id
    let projectPaper = await projectPapersDao.selectById(projectPaper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //if the paper has already filed screening (already evalueted by other method)
    if (projectPaper.data.screening) {
        throw errHandler.createBadRequestError("the projectPaper is already screening by other method!");
    }

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(projectPaper.project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    if (!project.data.screeners_id || !project.data.screeners_id.includes(user.id)) {
        throw errHandler.createBadRequestError("the user isn't a screeners of this project!");
    }

    //check if user already voted on this projectPaper
    let voteExistence = await votesDao.selectByProjectPaperIdAndUserId(projectPaper_id, user.id);
    if (voteExistence) {
        throw errHandler.createBadRequestError("the user already voted for this projectPaper!");
    }

    //create vote object
    let voteData = {"projectPaper_id": projectPaper_id, "user_id": user.id, "answer": answer};
    //insert the vote into DB
    let newVote = await votesDao.insert(voteData);


    //get all votes
    let allVotes = await votesDao.selectByProjectPaperId(projectPaper_id);
    //if votes's number = screeners's number
    if (allVotes.length === project.data.screeners.length) {

        //start screened paper

        let positiveNumber = 0;
        let negativeNumber = 0;
        //for each vote
        for (let i = 0; i < allVotes.length; i++) {
            //count thier negative cases and positive cases
            if (allVotes[i].data.answer === "0") {
                negativeNumber++;
            } else {
                positiveNumber++;
            }
        }

        //if paper hasn't metadata field in the data
        if (!projectPaper.data.metadata) {
            //create a new object
            projectPaper.data.metadata = {};
        }


        //create a object for screening
        projectPaper.data.metadata.screening = {};

        //set screening source
        projectPaper.data.metadata.screening.source = config.screening_source.manual_screening;
        //set screening result, false for default
        projectPaper.data.metadata.screening.result = 0;
        //if positive cases is greater than negative cases
        if (positiveNumber >= negativeNumber) {
            projectPaper.data.metadata.screening.result = 1;
        }

        //update the projectPaper Object
        await projectPapersDao.update(projectPaper_id, projectPaper);

    }


    return newVote;
}


module.exports = {
    automatedScreening,
    selectFromBackLogByProjectId,
    selectFromManualByProjectId,
    selectFromScreenedByProjectId,
    insertVote

};