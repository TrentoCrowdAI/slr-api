// this file exposes the logic implemented in projects.delegate.js
// as services using express

const express = require('express');
const projectsDelegate = require(__base + 'delegates/projects.delegate');

const router = express.Router();




//get a list of projects 
router.get('/projects', async (req, res, next) => {
    try
    {
        let tokenId = req.headers["authorization"];
        let projects = undefined;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        let query = req.query.query;
       // if(query === undefined){
            projects = await projectsDelegate.selectAllByUserId(tokenId,orderBy, sort, start, count);
     //   }else{
      //      projects = await projectsDelegate.selectBySingleKeyword(query, orderBy, sort, start, count);
      //  }
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
        let tokenId = req.headers["authorization"];
        //the data of new project to insert
        let newProjectData = req.body;
        let project = await projectsDelegate.insert(tokenId, newProjectData);
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
        let tokenId = req.headers["authorization"];
        let project_id = req.params.id;
        let project = await projectsDelegate.selectById(project_id, tokenId);
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

        let tokenId = req.headers["authorization"];
        let project_id = req.params.id;
        //the new data of project to update
        let newProjectData = req.body;
        
        await projectsDelegate.update(project_id, tokenId, newProjectData);
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
        let tokenId = req.headers["authorization"];
        let project_id = req.params.id;
        await projectsDelegate.deletes(project_id, tokenId);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
