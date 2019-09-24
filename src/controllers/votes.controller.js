// this file exposes the logic implemented in votes.delegate.js
// as services using express

const express = require('express');
const router = express.Router();

const votesDelegate = require(__base + 'delegates/votes.delegate');


/**
 * insert a vote
 */
router.post('/votes', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_paper_id = req.body.project_paper_id;

        let voteData = req.body.vote;

        let voteCreated = await votesDelegate.insert(user_email, voteData, project_paper_id);

        res.status(201).json(voteCreated);

    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/**
 * get the votes of a specific project
 * */
router.get('/votes', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;


        let votes = await votesDelegate.selectByProjectId(user_email, project_id);

        res.status(200).json(votes);

    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
