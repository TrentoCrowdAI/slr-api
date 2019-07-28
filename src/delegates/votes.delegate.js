// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const filtersDao = require(__base + 'dao/filters.dao');
const usersDao = require(__base + 'dao/users.dao');
const votesDao = require(__base + 'dao/votes.dao');
const screeningsDao = require(__base + 'dao/screenings.dao');


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
 * insert the vote of a exist projectPaper
 * change projectPaper screened status
 * if all vote is inserted, screens the paper by average of answer in votes
 * @param {string} user_email of user
 * @param {string} project_paper_id


 * @returns {Object} vote created
 */
async function insert(user_email, voteData, project_paper_id) {

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);

    //check validation of projectPaper_id and transform the value in integer
    project_paper_id = errorCheck.setAndCheckValidProjectPaperId(project_paper_id);


    //check format of vote data
    let valid = ajv.validate(validationSchemes.vote, voteData);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the new vote data is not valid!('+ ajv.errorsText()+')');
    }
    // check format of vote's metadata
    let valid2 = ajv.validate(validationSchemes.vote_metadata, voteData.metadata);
    //if is not a valid input
    if (!valid2) {
        throw errHandler.createBadRequestError('the new vote data.metadata is not valid!');
    }

    //check validation of answer
    if (voteData.answer !== "0" && voteData.answer !== "1" && voteData.answer !== "2") {
        throw errHandler.createBadRequestError("the answer isn't valid!");
    }

    //get projectPaper object by projectPaper id
    let projectPaper = await projectPapersDao.selectById(project_paper_id);
    errorCheck.isValidProjectPaper(projectPaper);

    //if the paper has already filed screened and screened value is not equal manual
    if (projectPaper.data.metadata && projectPaper.data.metadata.screened && projectPaper.data.metadata.screened !== config.screening_status.manual) {
        throw errHandler.createBadRequestError("the projectPaper is already screened!");
    }

    //get project id from projectPaper
    let project_id = projectPaper.project_id;
    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);


    //check existence of screener in screenings table
    let screeningsRecord = await screeningsDao.selectByUserIdAndProjectId(user.id, project_id);
    //if the selected user isn't present in the screenings table
    if (!screeningsRecord) {
        throw errHandler.createBadRequestError("the user isn't a screeners of this project!");
    }

    //check if user already voted on this projectPaper
    let voteExistence = await votesDao.selectByProjectPaperIdAndUserId(project_paper_id, user.id);
    if (voteExistence) {
        throw errHandler.createBadRequestError("the user already voted for this projectPaper!");
    }

    //insert the vote into DB
    let newVote = await votesDao.insert(voteData, user.id, project_paper_id, project_id);

    //copy the vote tags to tags of screenings table
    screeningsRecord.data.tags = voteData.metadata.tags;
    //update screenings record
    await screeningsDao.update(screeningsRecord.id, screeningsRecord.data);

    /*

    ####################################################################
    #################################################################

     */

    //if projectPaper hasn't metadata field in the data
    if (!projectPaper.data.metadata) {
        //create the metadata object
        projectPaper.data.metadata = {};
    }

    //get all votes
    let allVotes = await votesDao.selectByProjectPaperId(project_paper_id);
           
    //update paper metadata in order to include the vote
    if(!projectPaper.data.metadata.votes){
        projectPaper.data.metadata.votes = [
            {user: {name: user.data.name, picture: user.data.picture}, answer: voteData.answer}
        ];
    }else{
        projectPaper.data.metadata.votes.push({user: {name: user.data.name, picture: user.data.picture}, answer: voteData.answer});
    }


    //get number of screeners
    let numberScreeners = await screeningsDao.countByProject(project_id);

    //if votes's number  is equal to the number of screeners
    if (allVotes.length === parseInt(numberScreeners)) {

        //start screened paper
        let positiveNumber = 0;
        let negativeNumber = 0;
        //for each vote
        for (let i = 0; i < allVotes.length; i++) {
            //count their negative cases and positive cases
            if (allVotes[i].data.answer === "0") {
                negativeNumber++;
            } else if (allVotes[i].data.answer === "1"){
                positiveNumber++;
            }
        }

        //create a object for screening
        //set screening source
        //set screening result, 0 (false) for default
        projectPaper.data.metadata.screening = {source: config.screening_source.manual_screening, result: "0"};
        //if positive cases is greater or equal than negative cases
        if (positiveNumber >= negativeNumber) {
            projectPaper.data.metadata.screening.result = "1";
        }

        //set the projectPaper screened status of projectPaper as screened
        projectPaper.data.metadata.screened = config.screening_status.screened;

    }
    //if there aren't all votes
    else{
        //set the projectPaper screened status of projectPaper as manual
        projectPaper.data.metadata.screened = config.screening_status.manual;
    }

    //update the projectPaper Object
    await projectPapersDao.update(project_paper_id, projectPaper.data);


    return newVote;
}


/**
 *  select the all vote of a specific project
 * @param {string} user_email of user
 * @param {string} project_id

 * @returns {Object[]} vote created
 */
async function selectByProjectId(user_email, project_id) {

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


    //get all votes
    let votes = await votesDao.selectByProjectId(project_id);

    if (votes.length === 0) {
        throw errHandler.createNotFoundError('the list of votes is empty!');
    }

    return votes;
}


module.exports = {

    insert,
    selectByProjectId,
};