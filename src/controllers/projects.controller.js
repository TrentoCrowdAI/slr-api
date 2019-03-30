// this file exposes the logic implemented in projects.delegate.js
// as services using express

const express = require('express');
const projectsDelegate = require(__base + 'delegates/projects.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();




//get a list of projects 
router.get('/projects', async (req, res, next) => {
    try
    {
        let pagesize = req.query.pagesize;
        let after = req.query.after; //select projects with id greater than the value of after
        let before = req.query.before; //select projects with id lower than the value of before
        let projects = await projectsDelegate.selectAll(pagesize, after, before, "id", "ASC");
        res.status(200).json(projects);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new project
router.post('/projects', async (req, res, next) => {
    try
    {
        //the data of new project to insert
        let newProjectData = req.body;
        let project = await projectsDelegate.insert(newProjectData);
        res.status(201).json(project);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



//get a project by id
router.get('/projects/:id', async (req, res, next) => {
    try
    {
        let project_id = req.params.id;
        let project = await projectsDelegate.selectById(project_id);
        res.status(200).json(project);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a project by id
router.put('/projects/:id', async (req, res, next) => {
    try
    {
        
        let project_id = req.params.id;
        //the new data of project to update
        let newProjectData = req.body;
        
        await projectsDelegate.update(project_id,newProjectData);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a project by id
router.delete('/projects/:id', async (req, res, next) => {
    try
    {
        let project_id = req.params.id;
        await projectsDelegate.deletes(project_id);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
