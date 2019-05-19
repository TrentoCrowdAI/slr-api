// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const papersDelegate = require(__base + 'delegates/papers.delegate');


const router = express.Router();


//search for a word in the papers
router.get('/search', async (req, res, next) => {
    try
    {

        let query = req.query.query;
        let searchBy = req.query.searchBy;
        let year = req.query.year;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        let papers = await papersDelegate.scopusSearch(query, searchBy, year, orderBy, sort, start, count);

        res.status(200).json(papers);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//search for a word in the papers
router.post('/search/similar', async (req, res, next) => {
    try
    {

        //input
        let query = req.body.query;
        let file = req.body.file;

        //pagination parameters
        let start = req.body.start;
        let count = req.body.count;

        let papers = await papersDelegate.similarSearch(file, query, start, count);

        res.status(200).json(papers);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*
 * 
 * router deprecated-------------------------------------------------------------------------------
 * 
//get a list of papers without keywords
router.get('/papers', async (req, res, next) => {
    try
    {
        //for now it returns a list of 10 papers(sorted by id asc)
        let papers = await papersDelegate.selectAll(10, 0, "id", "ASC");
        res.status(200).json(papers);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//insert a new paper
router.post('/papers', async (req, res, next) => {
    try
    {
        //the data of new paper to insert
        let newPaperData = req.body;
        let paper = await papersDelegate.insert(newPaperData);
        res.status(201).json(paper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



//get a paper by id
router.get('/papers/:id', async (req, res, next) => {
    try
    {
        let paper_id = req.params.id;
        let paper = await papersDelegate.selectById(paper_id);
        res.status(200).json(paper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//update a paper by id
router.put('/papers/:id', async (req, res, next) => {
    try
    {
        
        let paper_id = req.params.id;
        //the new data of paper to update
        let newPaperData = req.body;
        
        await papersDelegate.update(paper_id,newPaperData);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

//delete a paper by id
router.delete('/papers/:id', async (req, res, next) => {
    try
    {
        let paper_id = req.params.id;
        await papersDelegate.deletes(paper_id);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

*/


module.exports = router;
