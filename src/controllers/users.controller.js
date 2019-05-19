// this file exposes the autenthication logic
// as services using express

const express = require('express');
const router = express.Router();

const usersDelegate = require(__base + 'delegates/users.delegate');


//gets the users info and logs him in database
router.get('/auth/login', async (req, res, next) => {

    try {
        let tokenId = req.body.tokenId;
        let userData = await usersDelegate.userLogin(tokenId);
        res.status(201).json(userData);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//logout the users , delete the specific token from database
router.get('/auth/logout', async (req, res, next) => {

    try {
        //get token id from header
        let tokenId = req.headers["authorization"];
        await usersDelegate.userLogout(tokenId);
        res.sendStatus(200);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




//check the validity  of token on all request
router.all('*', async function (req, res, next) {
    try {
        //get token id from header
        let authorization = req.headers["authorization"];

        //check user's existence
        await usersDelegate.checkUserByTokenId(authorization);
        //if it is ok, proceeds
        next();
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }

});



//gets the logged in user info
router.get('/user-info', async (req, res, next) => {

    try {
        let authorization = req.headers["authorization"];

        let userData = await usersDelegate.getUserByTokenId(authorization);
        res.status(200).json(userData);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
