// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const similarSearchDelegate = require(__base + 'delegates/external.similarSearch.delegate');

const router = express.Router();



/*fake service for searching of similar paper*/
router.post('/external/similar', async (req, res, next) => {
    try {

        //input
        let similarPaper = req.body.paperData;

        //pagination parameters
        let start = req.body.start;
        let count = req.body.count;

        let papers = await similarSearchDelegate.fakeSimilarSearchService(similarPaper, start, count);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});




module.exports = router;
