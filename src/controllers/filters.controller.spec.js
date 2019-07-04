const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

// valid examples
let validExample = {
    "project_id": "1",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};





const validTokenId = "test";



/* good cases*/
describe('good cases on filters ', () => {

    test('POST /filters should return 201', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/filters').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /filters/1 should return 204 if filter exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/1').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /filters/2 should return 204 if filter exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/2').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('GET /filters/:id should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/1').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('GET /filters should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters?project_id=1').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });



});



//not valid examples
let notValidExample = {
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExample2 = {
    "project_id": "abc",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExample3 = {
    "project_id": "1.5",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExample4 = {
    "project_id": "1",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
};

let notValidExample5 = {
    "project_id": "9999",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExample6 = {
    "project_id": "6",
    "name   ": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};



/*bad cases*/
describe('bad cases on filters ', () => {


    test('POST /filters should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/filters').send(notValidExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/filters').send(notValidExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/filters').send(notValidExample3).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/filters').send(notValidExample4).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /filters should return 401 if the project doesn\'t exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/filters').send(notValidExample5).set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('POST /filters should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/filters').send(notValidExample6).set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });



    test('PUT /filters/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/1.5').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/filters/abc').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/filters/1').send(notValidExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/filters/1').send(notValidExample4).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('PUT /filters/:id should return 404 if filter is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/99999').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });

    test('PUT /filters/:id should return 401 if the project doesn\'t exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/5').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('PUT /filters/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/6').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });





    test('DELETE /filters/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/filters/3.55').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('DELETE /filters should return 404 if filter is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });

    test('DELETE /filters/:id should return 401 if the project doesn\'t exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/5').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('DELETE /filters/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/6').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });


    test('GET /filters/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters/3.55').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('GET /filters/:id should return 404 if filter is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });


    test('GET /filters/:id should return 401 if the project doesn\'t exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/5').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('GET /filters/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/6').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });




    test('GET /filters should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1.5').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1&sort=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1&start=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1&start=-1').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1&count=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/filters?project_id=1&count=0').set('Authorization', validTokenId);
        expect(response.status).toBe(400);


    });


    test('GET /filters should return 401 if the project doesn\'t exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters?project_id=99999').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('GET /filters should return 401 if the user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters?project_id=6').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('GET /filters should return 404 if the result is empty', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters?project_id=3').set('Authorization', validTokenId);
        expect(response.status).toBe(404)
    });








});