// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');

const usersDelegate = require(__base + 'delegates/users.delegate');
const screeningsDelegate = require(__base + 'delegates/screenings.delegate');


const router = express.Router();

//get all screeners associated with a project
router.get('/screenings/users', async (req, res, next) => {

    try {
        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;
        let users = await usersDelegate.getScreenersByProjectId(user_email, project_id);
        res.status(200).json(users);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//add the screening in the table
router.post('/screenings', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        let project_id = req.body.project_id;
        let array_screener_id = req.body.array_user_ids;
        let manual_screening_type = req.body.manual_screening_type;
        let screenings = await screeningsDelegate.insertByArray(user_email, array_screener_id, manual_screening_type, project_id);
        res.status(201).json(screenings);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//delete a screening from the table
router.delete('/screenings', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;

        let screeners_id = req.query.user_id;
        let project_id = req.query.project_id;


        await screeningsDelegate.deletes(user_email, screeners_id, project_id);
        res.sendStatus(204);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*automated screening*/
router.post('/screenings/automated', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.body.project_id;
        let threshold = req.body.threshold;

        await screeningsDelegate.automatedScreening(user_email, project_id, threshold);
        res.sendStatus(204);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*get automated screening status*/
router.get('/screenings/automated', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;


        let result = await screeningsDelegate.getAutomatedScreeningStatus(user_email, project_id);
        res.status(200).json(result);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*get list of project associated with user by screening table*/
router.get('/screenings', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;

        let result = await screeningsDelegate.selectByScreeningUser(user_email, orderBy, sort, start, count);
        res.status(200).json(result);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*get screening information*/
router.get('/screenings/:screening_id', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let screening_id = req.params.screening_id;

        let screening = await screeningsDelegate.selectById(user_email, screening_id);
        res.status(200).json(screening);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*get  a last paper to vote from a specific screening*/
router.get('/screenings/:screening_id/next', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let screening_id = req.params.screening_id;

        let projectPaper = await screeningsDelegate.selectOneNotVotedByUserIdAndProjectId(user_email, screening_id);
        res.status(200).json(projectPaper);
    } catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
