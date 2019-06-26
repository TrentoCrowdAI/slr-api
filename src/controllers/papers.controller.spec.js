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

    test('POST /search/similar should return 200 if find any papers', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "Crowdsourcing developement"}}).set('Authorization', validTokenId).set('Content-Type', "application/json");
        expect(response.status).toBe(200);
    });


    /* deprecated ----------------------------------
     * 

    test('GET /papers should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers');
        expect(response.status).toBe(200);
    });

    test('GET /papers/20 should return 200 and paper if paper exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers/20');
        expect(response.status).toBe(200);
    });

    test('POST  /papers/ should return 201', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/papers').send(validExample1).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /papers/22 should return 204 if paper exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/papers/22').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/25 should return 204 if paper exists', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/papers/25');
        expect(response.status).toBe(204);
    });
    */

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
       response = await request(app).get('/search?query=a&count=26&scopus=true').set('Authorization', validTokenId);
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
       response = await request(app).get('/search?query=a&count=26&arXiv=true').set('Authorization', validTokenId);
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
        response = await request(app).post('/search/similar').send({"count": "26","paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        response = await request(app).post('/search/similar').send({}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);


    });


    test('POST /search/similar should return 404 if it finds nothing', async () => {

        jest.setTimeout(timeOut);

        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "abcdefghthdtgdfgf"}}).set('Authorization', validTokenId).set('Content-Type', "application/json");
        expect(response.status).toBe(404);

    });


});