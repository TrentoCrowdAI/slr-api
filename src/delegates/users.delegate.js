//library to check validity of google token
const {OAuth2Client} = require('google-auth-library');

const usersDao = require(__base + 'dao/users.dao');

//error handler
const errHandler = require(__base + 'utils/errors');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//fetch request
const conn = require(__base + 'utils/conn');
//the config file
const config = require(__base + 'config');


/**
 * gets the users info and logs him in database
 * @param {string} tokenId
 * @returns {Object} user
 */
/*
 async function userLogin(tokenId) {

 if (!tokenId) {
 throw errHandler.createBadRequestError("empty token id!");
 }

 //call Google api
 const oAuth2Client = new OAuth2Client(config.google_login_client_id);
 let ticket;
 try {
 ticket = await oAuth2Client.verifyIdToken({
 idToken: tokenId,
 audience: config.google_login_client_id,
 });
 }
 catch (e) {
 throw errHandler.createBadRequestError("the token is incorrect: "+e.message);
 }

 //get user object from response of google
 let user = ticket.getPayload();
 //set token_id
 user.token_id = tokenId;

 //check user's existence
 let existOfUser = await usersDao.checkUserByGoogleId(user.sub);

 let res;
 //if is a new user
 if(existOfUser===0){
 res= await usersDao.insert(user);
 }
 else{
 res= await usersDao.updateByGoogleId(user.sub, user);
 }

 return {
 "user": {"email": user.email, "name": user.given_name, "surname": user.family_name, "image": user.picture},
 "token": tokenId
 };
 }
 */

/**
 logout the users , delete the specific token from database
 */
/*
 async function userLogout(tokenId) {

 //error check for tokenId
 errorCheck.isValidTokenId(tokenId);

 let res = await usersDao.logoutByTokenId(tokenId);
 if(res===0){
 throw errHandler.createBadRequestError("the token does not match any user or user has already logged!");
 }
 }*/

/**
 * check user's existence by token Id
 * @param {string} tokenId
 * @returns {boolean} true if found, false if not found
 */
/*
 async function checkUserByTokenId(tokenId) {

 //error check for tokenId
 errorCheck.isValidTokenId(tokenId);

 //check user's existence in database
 let res =  await usersDao.checkUserByTokenId(tokenId);
 //if do not exist
 if(res===0){
 throw errHandler.createBadRequestError("the token does not match any user!");
 }

 }*/

/**
 * get user data by token Id
 * @param {string} tokenId
 * @returns {object} user found
 */

/*
 async function getUserByTokenId(tokenId) {

 //error check for tokenId
 errorCheck.isValidTokenId(tokenId);

 //check user's existence in database
 let res =  await usersDao.getUserByTokenId(tokenId);
 //if do not exist
 if(!res){
 throw errHandler.createBadRequestError("the token does not match any user!");
 }


 return {
 "user": {"email": res.data.email, "name": res.data.given_name, "surname": res.data.family_name, "image": res.data.picture},
 };
 }
 */

/**
 * verify the validity of token and return google id
 * @param {string} tokenId
 * @return {string} google's user id
 */
async function verifyToken(tokenId) {

    //error check for tokenId
    errorCheck.isValidTokenId(tokenId);

    let google_id;

    //special case for testing
    if (tokenId === "test") {
        google_id = tokenId;
        //check user's existence
        let userFromDB = await usersDao.getUserByGoogleId(google_id);
        //if isn't exist the test user in DB
        if (!userFromDB) {
            throw errHandler.createBadRequestError("the token is valid only for testing");
        }
    }

    //normal cases
    else {

        //call Google api
        const oAuth2Client = new OAuth2Client(config.google_login_client_id);
        let ticket;
        try {
            ticket = await oAuth2Client.verifyIdToken({
                idToken: tokenId,
                audience: config.google_login_client_id,
            });
        }
        catch (error) {
            throw errHandler.createBadRequestError("the token is not valid: " + error.message);
        }

        //get response object from response of google
        let googleResponse = ticket.getPayload();
        //create user object with propriety "google_id"
        let user = {
            google_id: googleResponse.sub,
        };

        //check user's existence by google id
        let userFromDB = await usersDao.getUserByGoogleId(user.google_id);

        //if it doesn't exist in DB yet
        if (!userFromDB) {
            //insert it
            let res = await usersDao.insert(user);
        }

        google_id = user.google_id;
    }


    return google_id;
}


module.exports = {
    //userLogin,
    //userLogout,
    //checkUserByTokenId,
    //getUserByTokenId,
    verifyToken,
};