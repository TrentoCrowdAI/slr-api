

const usersDao = require(__base + 'dao/users.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const screeningsDao = require(__base + 'dao/screenings.dao');

//library to check validity of google token
const {OAuth2Client} = require('google-auth-library');
//error handler
const errHandler = require(__base + 'utils/errors');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//the config file
const config = require(__base + 'config');





/**
 * verify the validity of token and return google email
 * @param {string} tokenId
 * @return {string} google's user id
 */
async function verifyToken(tokenId) {

    //error check for tokenId
    errorCheck.isValidTokenId(tokenId);

    let user_email;

    //special case for testing
    if (tokenId.indexOf("test") !== -1) {
        user_email = tokenId + "@gmail.com";
        //check user's existence
        let userFromDB = await usersDao.getUserByEmail(user_email);
        //if isn't exist the test user in DB
        if (!userFromDB) {
            throw errHandler.createUnauthorizedError("the token is valid only for testing");
        }
    }

    //normal cases
    else {

        //call Google api
        const oAuth2Client = new OAuth2Client(config.google.google_login_client_id);
        let ticket;
        try {
            ticket = await oAuth2Client.verifyIdToken({
                idToken: tokenId,
                audience: config.google.google_login_client_id,
            });
        }
        catch (error) {
            throw errHandler.createUnauthorizedError("the token is not valid: " + error.message);
        }

        //get response object from response of google
        let googleResponse = ticket.getPayload();
        //create user object with propriety "user_email"
        let user = {
            email: googleResponse.email,
            name: googleResponse.name,
            picture: googleResponse.picture,
        };

        //check user's existence by google email
        let userFromDB = await usersDao.getUserByEmail(user.email);

        //if it doesn't exist in DB yet 
        if (!userFromDB) {
            //insert it
            let res = await usersDao.insert(user);
        }
        //or never logged in
        else if (userFromDB.data && userFromDB.data.name !== user.name) {
            let res = await usersDao.update(user);
        }

        user_email = user.email;
    }


    return user_email;
}


/**
 * get a collaborator list by project id
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {Object[]} array of user object
 */


async function getCollaboratorByProjectId(user_email, project_id) {

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
    let res = await usersDao.getUserByArrayIds(project.data.user_id);
    return res;


}


/**
 * get a screeners list by project id
 * @param {string} user_email of user
 * @param {string} project_id
 * @returns {Object[]} array of user object
 */


async function getScreenersByProjectId(user_email, project_id) {

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

    //get all screeners's records
    let screenings = await screeningsDao.selectByProjectId(project_id);
    //extract user_id and create a new array of ids
    let users = support.arrayElementFieldToArray(screenings, "user_id");


    //call DAO layer
    let res = [];
    if (users && users.length > 0) { //first I check if there are any users
        res = await usersDao.getUserByArrayIds(users);
    }

    return res;


}


module.exports = {
    verifyToken,
    getCollaboratorByProjectId,
    getScreenersByProjectId,
};