// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const papersDelegate = require(__base + 'delegates/papers.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();


//search for a word in the papers
router.get('/search', async (req, res, next) => {
    try
    {
        let query = req.query.query;
        let page = req.query.page;
        let pagesize = req.query.pagesize;
        //for now it returns the first ten matched papers(sorted by id)
        let papers = await papersDelegate.selectBySingleKeyword(query, pagesize, page, "id", "ASC");

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
