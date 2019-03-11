// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const papersDelegate = require(__base + 'delegates/papers.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();





//search for a word in the papers content
router.get('/search', async (req, res, next) => {
    try
    {
        let query = req.query.query;
        //for now it returns the first ten matched papers(sorted by id)
        let papers = await papersDelegate.selectBySingleKeyword(query, 10, 0, "id", "ASC");

        //parses the value of property content of each paper by json
        for (let i = 0; i < papers.length; i++)
        {
            papers[i].content = JSON.parse(papers[i].content);
        }

        res.status(200).json(papers);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


//get a list of papers without keywords
router.get('/papers', async (req, res, next) => {
    try
    {
        //for now it returns a list of 10 papers(sorted by id asc)
        let papers = await papersDelegate.selectAll(10, 0, "id", "ASC");

        //parses the value of property content of each paper by json
        for (let i = 0; i < papers.length; i++)
        {
            papers[i].content = JSON.parse(papers[i].content);
        }
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
        //the value of new paper to insert
        let newpaper = req.body;
        let paper = await papersDelegate.insert(newpaper);
        //parses the value of property content by json
        paper.content = JSON.parse(paper.content);

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
        let paper_id = Number(req.params.id);
        let paper = await papersDelegate.selectById(paper_id);
        //parses the value of property content by json
        paper.content = JSON.parse(paper.content);
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
        
        let paper_id = Number(req.params.id);
        
        //the new value of paper to update
        let newpaper = req.body;
        newpaper.id = paper_id;
        
        await papersDelegate.update(newpaper);
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
        let paper_id = Number(req.params.id);
        await papersDelegate.deletes(paper_id);
        res.sendStatus(204);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
