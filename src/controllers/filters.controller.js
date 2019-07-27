// this file exposes the logic implemented in filters.delegate.js
// as services using express

const express = require('express');

const filtersDelegate = require(__base + 'delegates/filters.delegate');

const router = express.Router();


/*get a list of filters associated with a project*/
router.get('/filters', async (req, res, next) => {


    try {

        let user_email = res.locals.user_email;
        let project_id = req.query.project_id;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        //let searchBy = req.query.searchBy;

        let filters = await filtersDelegate.selectByProject(user_email, project_id, "id", sort, start, count);

        res.status(200).json(filters);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new filter
router.post('/filters', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;
        let newFilterData = req.body.filter;
        let project_id = req.body.project_id;
        let filter = await filtersDelegate.insert(user_email, newFilterData, project_id);

        res.status(201).json(filter);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//get a filter
router.get('/filters/:filter_id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;
        let filter_id = req.params.filter_id;
        let filter = await filtersDelegate.selectById(user_email, filter_id);
        res.status(200).json(filter);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a filter
router.put('/filters/:filter_id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;
        let filter_id = req.params.filter_id;
        //the new data of filter to update
        let newFilterData = req.body;
        
        await filtersDelegate.update(user_email, filter_id, newFilterData);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a filter
router.delete('/filters/:filter_id', async (req, res, next) => {
    try {

        let user_email = res.locals.user_email;
        let filter_id = req.params.filter_id;
        await filtersDelegate.deletes(user_email, filter_id);
        res.sendStatus(204);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


module.exports = router;
