// this file exposes the autenthication logic
// as services using express

const express = require('express');

const usersDelegate = require(__base + 'delegates/users.delegate');

const router = express.Router();


//validate the token of the user
router.post('/auth/login', async (req, res, next) => {
    try
    {
        let tokenId = req.body.tokenId;
        //fetch the user data from google
        let userData = await usersDelegate.userLogin(tokenId);
        res.status(201).json(userData);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
