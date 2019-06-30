const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

const validTokenId = "test";



/* good cases*/
describe('good cases on papers', () => {

    test('GET /search should return 200 if find any papers on scopus', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015&scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });
    test('GET /search should return 200 if find any papers on arXiv', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015&arXiv=true').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    /*
    test('POST /search/similar should return 200 if find any papers', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "Crowdsourcing developement"}}).set('Authorization', validTokenId).set('Content-Type', "application/json");
        expect(response.status).toBe(200);
    });*/


});






/*bad cases*/
describe('bad cases on papers', () => {

    test('GET /search should return 400 if any source isn\'t defined', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('GET /search should return 400 if query field is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/search?scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(400)
    });

   test('GET /search should return 400 if parameters have illegal value', async () => {
        jest.setTimeout(timeOut);

        //cases on scopus
        let response = await request(app).get('/search?query=a&searchBy=abc&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&year=sdsa&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&orderBy=123&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&sort=abc&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&start=-1&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&start=abc&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&count=abc&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&count=0&scopus=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);


       //cases on arXiv
       response = await request(app).get('/search?query=a&searchBy=abc&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&orderBy=123&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&sort=abc&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&start=-1&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&start=abc&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&count=abc&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);
       response = await request(app).get('/search?query=a&count=0&arXiv=true').set('Authorization', validTokenId);
       expect(response.status).toBe(400);

    });

    test('GET /search should return 404 if it finds nothing', async () => {
        jest.setTimeout(30000);
        let response = await request(app).get('/search?query=uaidafhhhha&scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(404)
        response = await request(app).get('/search?query=uaidafhhhha&arXiv=true').set('Authorization', validTokenId);
        expect(response.status).toBe(404)
    });

    test('POST /search/similar should return 400 if parameters have illegal value', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/search/similar').send({"start": "abc","paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/similar').send({"start": "-1","paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/similar').send({"count": "abc","paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/similar').send({"count": "0","paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        response = await request(app).post('/search/similar').send({}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });


    test('POST /search/automated should return 400 if parameters have illegal value', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/search/automated').send({"description": "abc","arrayFilterId" : ["1","2"]}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","arrayFilterId" : ["1","2"]}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : "abc"}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : []}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : [1,"b"]}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : [1,2], "start": "abc"}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : [1,2], "start":  -1}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : [1,2], "count":  "abcs"}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/search/automated').send({"title": "abc","description": "abc", "arrayFilterId" : [1,2], "count":  0}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });



/*
    test('POST /search/similar should return 404 if it finds nothing', async () => {

        jest.setTimeout(timeOut);

        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "abcdefghthdtgdfgf"}}).set('Authorization', validTokenId).set('Content-Type', "application/json");
        expect(response.status).toBe(404);

    });*/



});