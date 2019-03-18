const request = require('supertest');
const app = require(__base + 'app');

// valid examples
var validExample1 = {"name": "aa",
    "description": "aaa"
};
// valid examples
var validExample2 = {"name": "bb",
    "description": "aaa"
};

//not valid examples
var notValidExampleForInsert = {"name": "aa"};

//not valid examples
var notValidExampleForUpdate = {"names": "bb",
    "description": "aaa"
};



test('dummy test', () => {
    expect(true).toBe(true);
});

/* good cases*/
describe('good cases', () => {


    test('GET /projects should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects');
        expect(response.status).toBe(200);
    });

    test('GET /projects/1 should return 200 and project if project exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/2');
        expect(response.status).toBe(200);
    });

    test('POST  /projects/ should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects').send(validExample1).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /projects/22 should return 204 if project exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/4').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /projects/5 should return 204 if project exists', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/projects/5');
        expect(response.status).toBe(204);
    });

});






/*bad cases*/
describe('bad cases', () => {



    test('GET /projects/9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/9999');
        expect(response.status).toBe(404)
    });

    test('POST /projects/ should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects').send(notValidExampleForInsert).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });


    test('PUT /projects/2 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/2').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /projects/9999 should return 404 if projects is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/9999').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(404);
    });


    test('DELETE /projects/abc should return 400 if id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/abc');
        expect(response.status).toBe(400);
    });

    test('DELETE /projects/9999 should return 404 if projects is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/9999');
        expect(response.status).toBe(404);
    });


});