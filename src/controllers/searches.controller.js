// this file exposes the logic implemented in searches.delegate.js
// as services using express

const express = require('express');
const searchesDelegate = require(__base + 'delegates/searches.delegate');

const router = express.Router();


/*search for a word in the papers*/
router.get('/search', async (req, res, next) => {
    try {

        let query = req.query.query;
        let searchBy = req.query.searchBy;
        let year = req.query.year;
        let orderBy = req.query.orderBy;
        let sort = req.query.sort;
        let start = req.query.start;
        let count = req.query.count;
        let scopus = req.query.scopus;
        let arXiv = req.query.arXiv;
        let papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});

/*search the similar paper*/
router.post('/search/similar', async (req, res, next) => {
    try {

        //input
        let similarPaper = req.body.paperData;

        //pagination parameters
        let start = req.body.start;
        let count = req.body.count;

        let papers = await searchesDelegate.similarSearch(similarPaper, start, count);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*search the similar paper*/
router.post('/search/automated', async (req, res, next) => {
    try {

       let user_email = res.locals.user_email;
       let project_id = req.body.project_id;

       //confidence range
        let min_confidence =req.body.min_confidence;
        let max_confidence =req.body.max_confidence;

       //pagination parameters
       let start = req.body.start;
       let count = req.body.count;

       let papers = await searchesDelegate.automatedSearch(user_email, project_id, min_confidence, max_confidence,start, count);

        res.status(200).json(papers);
    }
    catch (e) {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});





module.exports = router;
