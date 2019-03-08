// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
//const papersDelegate = require(__base + 'delegates/papers.delegate');

const router = express.Router();

router.get('/search', async (req, res, next) => {
  try {
    res.status(201).json({"msg": "search"});
  } catch (e) {
    // we delegate to the error-handling middleware
    next(e);
  }
});

router.get('/papers/:id', async (req, res, next) => {
  try {
    let paper_id = req.params.id;
    res.status(201).json({"id": paper_id});
  } catch (e) {
    // we delegate to the error-handling middleware
    next(e);
  }
});

module.exports = router;
