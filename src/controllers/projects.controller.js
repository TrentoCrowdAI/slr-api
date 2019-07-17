// this file exposes the logic implemented in projects.delegate.js
// as services using express

const express = require('express');
const projectsDelegate = require(__base + 'delegates/projects.delegate');
const usersDelegate = require(__base + 'delegates/users.delegate');

const router = express.Router();


//get a list of projects
router.get('/projects', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;


        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;


        let projects = await projectsDelegate.selectByUserId(user_email, orderBy, sort, start, count);

        res.status(200).json(projects);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new project
router.post('/projects', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        //the data of new project to insert
        let newProjectData = req.body;
        let project = await projectsDelegate.insert(user_email, newProjectData);
        res.status(201).json(project);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




//get a project by id
router.get('/projects/:id', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        let project = await projectsDelegate.selectById(user_email, project_id);
        res.status(200).json(project);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a project by id
router.put('/projects/:id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        //the new data of project to update
        let newProjectData = req.body;

        await projectsDelegate.updateNameAndDescription(user_email, project_id, newProjectData);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a project by id
router.delete('/projects/:id', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        await projectsDelegate.deletes(user_email, project_id);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



//get a collaborator list by project
router.get('/projects/:id/collaborators', async (req, res, next) => {

    try {
        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        let userData = await usersDelegate.getCollaboratorByProjectId(user_email, project_id);
        res.status(200).json(userData);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//share the project with other user
router.post('/projects/:id/collaborators', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        let collaborator_email = req.body.email;
        let userData = await projectsDelegate.shareProject(user_email, project_id, collaborator_email);
        res.status(201).json(userData);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a collaborator from a project
router.delete('/projects/:id/collaborators/:user_id', async (req, res, next) => {
    try {
        let user_email = res.locals.user_email;
        let project_id = req.params.id;
        let collaborator_id = req.params.user_id;

        await projectsDelegate.deleteShareProject(user_email, project_id, collaborator_id);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});











module.exports = router;
