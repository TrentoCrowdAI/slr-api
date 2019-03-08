// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const papersDelegate = require(__base + 'delegates/papers.delegate');

const router = express.Router();

router.get('/search', async (req, res, next) => {
  try {
    let query = req.query.query;
    let papers = await papersDelegate.selectBySingleKeyword(query,3,0,"id","ASC");
    res.status(200).json(papers);
  } catch (e) {
    // we delegate to the error-handling middleware
    next(e);
  }
});

router.get('/papers/:id', async (req, res, next) => {
  try {
    let paper_id = parseInt(req.params.id, 10);
    if (isNaN(paper_id)) {
      res.status(403).json({"statusCode" : 403, "message" : "the id is not a number"});
      return;
    }
    let paper = await papersDelegate.selectById(paper_id);
    paper.content = JSON.parse(paper.content);
    res.status(200).json(paper);
  } catch (e) {
    // we delegate to the error-handling middleware
    next(e);
  }
});

module.exports = router;
