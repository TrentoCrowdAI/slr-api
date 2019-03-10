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
        res.status(200).json(papers);
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
        //parses the value of property content from json
        paper.content = JSON.parse(paper.content);
        res.status(200).json(paper);
    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
