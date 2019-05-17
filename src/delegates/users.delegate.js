
//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//fetch request
const conn = require(__base + 'utils/conn');

/**
 * gets the users info and logs him in
 */
async function userLogin(tokenId) {

    if (!tokenId) {
        throw errHandler.createBadRequestError("empty token id!");
    }

    //call Google api
    let res = await conn.get("https://www.googleapis.com/oauth2/v3/tokeninfo", {"id_token" : tokenId});

    if(!res.email){
        throw errHandler.createBadRequestError("the token is incorrect!");
    }

    //in case of success do the following steps
    //(1) check if the user exists
    //(1.1) add the user to the Users table if it doesn't exist
    
    //(2) generate token for user and add him to the ActiveUsers table

    //(3) send token and user data to client

    return  {
            "user": {"email" : res.email, "name" : res.given_name, "surname" : res.family_name, "image" : res.picture}, 
            "token": 123
            };
}


module.exports = {
    userLogin
};