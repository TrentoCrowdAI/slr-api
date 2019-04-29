// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');
const projectPapersDelegate = require(__base + 'delegates/projectPapers.delegate');

const router = express.Router();


//get a list of projectPapers associated with a project
router.get('/papers', async (req, res, next) => {

    let projectPapers = undefined;

    try {
        let project_id = req.query.project_id;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        let searchBy = req.query.searchBy;
        let year = req.query.year;
        let query = req.query.query;
        if (query === undefined) {
            projectPapers = await projectPapersDelegate.selectByProject(project_id, orderBy, sort, start, count);
        }
        else {
            projectPapers = await projectPapersDelegate.searchPaperByProject(query, project_id, searchBy, year, orderBy, sort, start, count);
        }
        res.status(200).json(projectPapers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new projectPaper
router.post('/papers', async (req, res, next) => {
    try {
        let projectPaper = null;
        let arrayEid = req.body.arrayEid;
        let project_id = req.body.project_id;
        if(arrayEid){
            projectPaper = await projectPapersDelegate.insertFromPaper(arrayEid, project_id);
        }else{
            let newPaper = req.body.paper;
            projectPaper = await projectPapersDelegate.insertCustomPaper(newPaper, project_id);
        }
        res.status(201).json(projectPaper);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


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
});

//update a projectPaper
router.put('/papers/:projectPaper_id', async (req, res, next) => {
    try {

        let projectPaper_id = req.params.projectPaper_id;
        //the new data of projectPaper to update
        let newProjectPaperData = req.body;

        await projectPapersDelegate.update(projectPaper_id, newProjectPaperData);
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
        let projectPaper_id = req.params.projectPaper_id;
        await projectPapersDelegate.deletes(projectPaper_id);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
