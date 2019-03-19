// this file exposes the logic implemented in projectPapers.delegate.js
// as services using express

const express = require('express');
const projectPapersDelegate = require(__base + 'delegates/projectPapers.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();




//get a list of projectPapers associated with a project
router.get('/projects/:project_id/papers', async (req, res, next) => {
    try
    {
        let project_id = req.params.project_id;
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
router.post('/projects/:project_id/papers/:paper_id', async (req, res, next) => {
    try
    {
        let project_id = req.params.project_id;
        let paper_id = req.params.paper_id;
        //the data of new projectPaper to insert
        let newProjectPaperData = req.body;
        let projectPaper = await projectPapersDelegate.insert(paper_id, project_id, newProjectPaperData);
        res.status(201).json(projectPaper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



//get a projectPaper 
router.get('/projects/:project_id/papers/:paper_id', async (req, res, next) => {
    try
    {
        let project_id = req.params.project_id;
        let paper_id = req.params.paper_id;
        let projectPaper = await projectPapersDelegate.selectById(paper_id, project_id);
        res.status(200).json(projectPaper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a projectPaper
router.put('/projects/:project_id/papers/:paper_id', async (req, res, next) => {
    try
    {

        let project_id = req.params.project_id;
        let paper_id = req.params.paper_id;
        //the new data of projectPaper to update
        let newProjectPaperData = req.body;

        await projectPapersDelegate.update(paper_id, project_id, newProjectPaperData);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a projectPaper
router.delete('/projects/:project_id/papers/:paper_id', async (req, res, next) => {
    try
    {
        let project_id = req.params.project_id;
        let paper_id = req.params.paper_id;
        await projectPapersDelegate.deletes(paper_id, project_id);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
