// this file exposes the logic implemented in papers.delegate.js
// as services using express

const express = require('express');
const externalServicesDelegate = require(__base + 'delegates/external.services.delegate');

const router = express.Router();



/*fake service for searching of similar paper*/
router.post('/external/similar', async (req, res, next) => {
    try {

        //input
        let similarPaper = req.body.paperData;

        //pagination parameters
        let start = req.body.start;
        let count = req.body.count;

        let papers = await externalServicesDelegate.fakeSimilarSearchService(similarPaper, start, count);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*fake service for automated searching*/
router.post('/external/automated', async (req, res, next) => {
    try {

        //input
        let title = req.body.title;
        let description = req.body.description;
        let arrayFilter = req.body.arrayFilter;

        //confidence range
        let min_confidence =req.body.min_confidence;
        let max_confidence =req.body.max_confidence;

        //pagination parameters
        let start = req.body.start;
        let count = req.body.count;

        let papers = await externalServicesDelegate.fakeAutomatedSearchService(title, description, arrayFilter, min_confidence, max_confidence,start, count);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



module.exports = router;
