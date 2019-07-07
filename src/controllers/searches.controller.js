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

/*
 * 
 * router deprecated-------------------------------------------------------------------------------
 * 
 //get a list of papers without keywords
 router.get('/papers', async (req, res, next) => {
 try
 {
 //for now it returns a list of 10 papers(sorted by id asc)
 let papers = await searchesDelegate.selectAll(10, 0, "id", "ASC");
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
 let paper = await searchesDelegate.insert(newPaperData);
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
 let paper = await searchesDelegate.selectById(paper_id);
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

 await searchesDelegate.update(paper_id,newPaperData);
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
 await searchesDelegate.deletes(paper_id);
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
