const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

const searchesDelegate = require(__base + 'delegates/searches.delegate');

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound",
    badImplementation: "badImplementation",
    unauthorized: "unauthorized",
     //to add the other error names
    
};

/* *
* range of usable data n° 16 ~ 30
* 21~25 for delegate layer
* */
const index = 21;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;

let query,searchBy, year, orderBy, sort, start, count, scopus, arXiv, papers;

/* good cases=====================================================================================================*/
//valid user_email
const valid_user_email = "test@gmail.com";

describe('good cases on search.delegate', () => {

    beforeEach(() => {
        query = '2010'; searchBy = undefined; year = undefined; orderBy = undefined; sort = undefined; start = undefined; count = undefined; scopus = undefined; arXiv = undefined;
    });

    test('search.delegate.search() should return 10 scopus results', async () => {
        jest.setTimeout(15000);

        scopus = "true";

        papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);

        expect(papers.results.length).toBe(10);
    });

    test('search.delegate.search() should return 10 arXiv results', async () => {
        jest.setTimeout(15000);

        arXiv = "true";

        papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);

        expect(papers.results.length).toBe(10);
    });

});


/* bad cases==============================================================================================================*/

describe('bad cases on search.delegate', () => {

    describe('bad cases on search.delegate.search()', () => {

        beforeEach(() => {
            query = '2010'; searchBy = undefined; year = undefined; orderBy = undefined; sort = undefined; start = undefined; count = undefined; scopus = undefined; arXiv = undefined;
        });

        test('it should return error \'badRequest\' if source is not specified', async () => {

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if query is empty', async () => {

            query = undefined;

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if searchBy is not valid', async () => {

            scopus = "true"; searchBy = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if year is not valid', async () => {

            scopus = "true"; year = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if orderBy is not valid', async () => {

            scopus = "true"; orderBy = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if sort is not valid', async () => {

            scopus = "true"; sort = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if start is not a number', async () => {

            scopus = "true"; start = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if start is lower than 0', async () => {

            scopus = "true"; start = -1;

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if count is not a number', async () => {

            scopus = "true"; count = "abc";

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

        test('it should return error \'badRequest\' if count is lower than 0', async () => {

            scopus = "true"; count = -1;

            try{
                papers = await searchesDelegate.search(query, searchBy, year, orderBy, sort, start, count, scopus, arXiv);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });

    });


    /*similar search==============================================================================================*/
    describe('bad cases on search.delegate.searchSimilar()', () => {

        test('it should return error \'badImplementation\' if the parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //paperData is empty
            try{
                papers = await searchesDelegate.similarSearch({}, 0, 10);
            }catch(e){
                papers = e;
                console.log(e.message);
            }
            expect(papers.name).toBe(errorNames.badImplementation);

        });
    });


    /*automated search==============================================================================================*/
    describe('bad cases on search.delegate.searchAutomated()', () => {

        test('it should return error \'badRequest\' if illegal values', async () => {
            jest.setTimeout(timeOut);

            //project id not a number
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, "abc", 0.0, 1.0, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

            //min confidence not a number
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 1, "abc", 1.0, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

            //min confidence lower than 0
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 1, -0.1, 1.0, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

            //max confidence not a number
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 1, 0.0, "abc", 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

            //max confidence lower than 0
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 1, 0.0, -0.1, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

            //max confidence lower than min confidence
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 1, 0.6, 0.1, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.badRequest);

        });
        test('it should return \'unauthorized\' if project does not exist', async () => {
            try{
                papers = await searchesDelegate.automatedSearch(valid_user_email, 99999999, 0.0, 1.0, 0, 10);
            }catch(e){
                papers = e;
            }
            expect(papers.name).toBe(errorNames.unauthorized);
        });

    });


});