// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');
const projectPapersDelegate = require(__base + 'delegates/projectPapers.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();




//get a list of projectPapers associated with a project
router.get('/papers', async (req, res, next) => {
    try
    {
        let project_id = req.query.project_id;
        //for now it returns a list of 10 projectPapers(sorted by id asc)
        let projectPapers = await projectPapersDelegate.selectByProject(project_id, 10, 0, "id", "ASC");
        res.status(200).json(projectPapers);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new projectPaper
router.post('/papers', async (req, res, next) => {
    try
    {
        let paper_id = req.body.paper_id;
        let project_id = req.body.project_id;
        
        let projectPaper = await projectPapersDelegate.insertFromPaper(paper_id, project_id);
        res.status(201).json(projectPaper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



//get a projectPaper 
router.get('/papers/:projectPaper_id', async (req, res, next) => {
    try
    {
        let projectPaper_id = req.params.projectPaper_id;
        let projectPaper = await projectPapersDelegate.selectById(projectPaper_id);
        res.status(200).json(projectPaper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a projectPaper
router.put('/papers/:projectPaper_id', async (req, res, next) => {
    try
    {

        let projectPaper_id = req.params.projectPaper_id;
        //the new data of projectPaper to update
        let newProjectPaperData = req.body;

        await projectPapersDelegate.update(projectPaper_id, newProjectPaperData);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a projectPaper
router.delete('/papers/:projectPaper_id', async (req, res, next) => {
    try
    {
        let projectPaper_id = req.params.projectPaper_id;
        await projectPapersDelegate.deletes(projectPaper_id);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
