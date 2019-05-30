const request = require('supertest');
const app = require(__base + 'app');


const validTokenId = "test";


test('dummy test', () => {
    expect(true).toBe(true);
});

/* good cases*/
describe('good cases', () => {

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
        jest.setTimeout(10000);
        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "Crowdsourcing developement"}}).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


    /* deprecated ----------------------------------
     * 

    test('GET /papers should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers');
        expect(response.status).toBe(200);
    });

    test('GET /papers/20 should return 200 and paper if paper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/20');
        expect(response.status).toBe(200);
    });

    test('POST  /papers/ should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(validExample1).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /papers/22 should return 204 if paper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/22').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/25 should return 204 if paper exists', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/papers/25');
        expect(response.status).toBe(204);
    });
    */

});






/*bad cases*/
describe('bad cases', () => {

    test('GET /search should return 400 if there aren\'t any source', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('GET /search should return 400 if mandatory field is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search?scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(400)
    });
   test('GET /search should return 400 if optional field has illegal value', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search?query=a&count=-1&scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(400)
    });
    test('GET /search should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search?query=uaidafha&scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(404)
    });
    test('POST /search/similar should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/search/similar').send({"paperData" : {"title" : "."}}).set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });
    
        /* deprecated ----------------------------------
     * 
    
    test('GET /papers/9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/9999');
        expect(response.status).toBe(404)
    });


    test('POST /papers/ should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(notValidExampleForInsert).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });


    test('PUT /papers/21 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/21').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /papers/9999 should return 404 if papers is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/9999').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(404);
    });


    test('DELETE /papers/abc should return 400 if id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/abc');
        expect(response.status).toBe(400);
    });

    test('DELETE /papers/9999 should return 404 if papers is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/9999');
        expect(response.status).toBe(404);
    });
    */

});