// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');

const screeningDelegate = require(__base + 'delegates/screening.delegate');

const router = express.Router();


/*get projectPaper in the backlog*/
router.get('/screening/backlog', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;

        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;

        let orderBy ="date_created";


        let projectPapers = await screeningDelegate.selectFromBackLogByProjectId(user_email, project_id, orderBy, sort, start, count);

        res.status(200).json(projectPapers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*get projectPaper in the backlog*/
router.get('/screening/manual', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;

        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;

        let orderBy ="date_created";

        let projectPapers = await screeningDelegate.selectFromManualByProjectId(user_email, project_id, orderBy, sort, start, count);

        res.status(200).json(projectPapers);

    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*get projectPaper in the backlog*/
router.get('/screening/screened', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;

        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;

        let orderBy ="date_created";

        let projectPapers = await screeningDelegate.selectFromScreenedByProjectId(user_email, project_id, orderBy, sort, start, count);

        res.status(200).json(projectPapers);

    }

    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*automated screening*/
router.post('/screening/automated', async (req, res, next) => {

    try {

        let user_email = res.locals.user_email;
        let project_id = req.body.project_id;
        let threshold = req.body.threshold;

        await screeningDelegate.automatedScreening(user_email, project_id, threshold) ;
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});






module.exports = router;
