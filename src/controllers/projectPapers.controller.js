// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');

const projectPapersDelegate = require(__base + 'delegates/projectPapers.delegate');

const router = express.Router();


/*get a list of projectPapers associated with a project*/
router.get('/papers', async (req, res, next) => {

    let projectPapers = undefined;

    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        //let searchBy = req.query.searchBy;
        //let year = req.query.year;
        //let query = req.query.query;
        let type = req.query.type;
        let min_confidence = req.query.min_confidence;
        let max_confidence = req.query.max_confidence;

        projectPapers = await projectPapersDelegate.selectByProject(user_email, project_id, type, orderBy, sort, start, count, min_confidence, max_confidence);

        res.status(200).json(projectPapers);

    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*insert the new projectPapers by array of eids*/
router.post('/papers', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;

        let arrayEid = req.body.arrayEid;
        let project_id = req.body.project_id;
        let projectPaper = await projectPapersDelegate.insertFromPaper(user_email, arrayEid, project_id);
        res.status(201).json(projectPaper);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//insert a new projectPaper manual
router.post('/customPapers', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;

        let project_id = req.body.project_id;
        let newPaper = req.body.paper;
        let projectPaper = await projectPapersDelegate.insertCustomPaper(user_email, project_id, newPaper);

        res.status(201).json(projectPaper);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*
 //get a projectPaper
 router.get('/papers/:projectPaper_id', async (req, res, next) => {
 try {

 let projectPaper_id = req.params.projectPaper_id;
 let projectPaper = await projectPapersDelegate.selectById(projectPaper_id);
 res.status(200).json(projectPaper);
 }
 catch (e) {
 // catch the error threw from delegate and we delegate to the error-handling middleware
 next(e);
 }
 });*/

//update a projectPaper
router.put('/papers/:projectPaper_id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;

        let projectPaper_id = req.params.projectPaper_id;
        //the new data of projectPaper to update
        let newProjectPaperData = req.body;

        await projectPapersDelegate.update(user_email, projectPaper_id, newProjectPaperData);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a projectPaper
router.delete('/papers/:projectPaper_id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;

        let projectPaper_id = req.params.projectPaper_id;
        await projectPapersDelegate.deletes(user_email, projectPaper_id);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
