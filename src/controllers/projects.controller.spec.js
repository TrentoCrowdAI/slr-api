const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

// valid examples
const validExample1 = {
    "name": "aa",
    "description": "aaa"
};
// valid examples
const validExample2 = {
    "name": "bb",
    "description": "aaa"
};
const validEmail = {"email": "123@gmail.com"};
const validEmail2 = {"email": "test@gmail.com"};


const validTokenId = "test";



/* good cases*/
describe('good cases on projects', () => {

    test('POST  /projects should return 201', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/projects').send(validExample1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /projects/:id should return 204 if project exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/projects/3').send(validExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /projects/:id should return 204 if project exists', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/projects/4').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('GET /projects/:id should return 200 if project exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/2').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


    test('GET /projects should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


    test('GET /projects/1/collaborators should return 200', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/1/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST /projects/1/collaborators should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/projects/1/collaborators').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });

    test('DELETE /projects/1/collaborators/2 should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/projects/1/collaborators/2').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


});


//not valid examples
const notValidExampleForInsert1 = {"name": "aa"};
const notValidExampleForInsert2 = {
    "name": "",
    "description": "aaa"
};
//not valid examples
const notValidExampleForUpdate = {
    "names": "bb",
    "description": "aaa"
};
const notValidExampleForUpdate2 = {
    "name": "bb",
    "description": ""
};

const notValidEmail = {"email": "notValid@com"};
const notExistEmail = {"email": "678@gmail.com"};

/*bad cases*/
describe('bad cases on projects', () => {


    test('POST /projects/ should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/projects').send(notValidExampleForInsert1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/projects').send(notValidExampleForInsert2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('PUT /projects/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/projects/abc').send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/projects/1.8').send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        response = await request(app).put('/projects/2').send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/projects/2').send(notValidExampleForUpdate2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);


    });

    test('PUT /projects/:id should return 401 if projects is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/projects/9999').send(validExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('PUT /projects/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/projects/6').send(validExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('DELETE /projects/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/projects/1.5').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('DELETE /projects/:id return 401 if projects is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('DELETE /projects/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/6').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('GET /projects/:id should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects/1.5').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('GET /projects/:id should return 401 if it finds nothing', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('GET /projects/:id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/6').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('GET /projects should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);

        response = await request(app).get('/projects?&orderBy=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&sort=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&start=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&start=-1').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&count=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&count=0').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects?&count=26').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('GET /projects should return 404 if it finds nothing after the given offset', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects?start=99999').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });


    test('POST /projects/:id/collaborators should return 400 if parameters aren\'t valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/projects/abc/collaborators').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/projects/1.5/collaborators').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/projects/1/collaborators').send({}).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/projects/1/collaborators').send(notValidEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('POST /projects/:id/collaborators should return 401 if it finds nothing', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/projects/9999/collaborators').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('POST /projects/:id/collaborators should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/projects/9999/collaborators').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('POST /projects/:id/collaborators should return 400 if the shared user is already present in this project', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/projects/1/collaborators').send(validEmail2).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('DELETE /projects/:id/collaborators/:c_id should return 400 if parameters aren\'t valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/abc/collaborators/1').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/projects/1.5/collaborators/1').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/projects/1/collaborators/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/projects/1/collaborators/1.5').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });


    test('DELETE /projects/:id/collaborators/:c_id should return 401 if it finds nothing', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/9999/collaborators/1').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('DELETE /projects/:id/collaborators/:c_id should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/projects/6/collaborators/1').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('DELETE /projects/:id/collaborators/:c_id should return 400 if the user_id isn\'t among the collaborators', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/projects/1/collaborators/2').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });



    test('GET /projects/:id/collaborators should return 400 if parameters aren\'t valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/abc/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/projects/1.5/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('GET /projects/:id/collaborators should return 401 if it finds nothing', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/9999/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('GET /projects/:id/collaborators should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/9999/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });



});