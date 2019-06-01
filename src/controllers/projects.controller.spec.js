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
var notValidExampleForInsert1 = {"name": "aa"};

var notValidExampleForInsert2 = {"name": "",
    "description": "aaa"
};
//not valid examples
var notValidExampleForUpdate = {"names": "bb",
    "description": "aaa"
};

const validTokenId = "test";
const validEmail = {"email":"123@gmail.com"};
const validEmail2 = {"email":"test@gmail.com"};
const notValidEmail = {"email":"notValid@com"};
const notExistEmail = {"email":"678@gmail.com"};

test('dummy test', () => {
    expect(true).toBe(true);
});

/* good cases*/
describe('good cases', () => {


    test('GET /projects should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });




    test('GET /projects/2 should return 200 and project if project exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/2').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

   /* test('GET /projects?query=a should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects?query=a').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });*/

    test('POST  /projects/ should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects').send(validExample1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /projects/3 should return 204 if project exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/3').send(validExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /projects/4 should return 204 if project exists', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/projects/4').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('POST /projects/1/share should return 204', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/1/share').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('POST /projects/3/deleteShare should return 204', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/3/deleteShare').send(validEmail2).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });
});






/*bad cases*/
describe('bad cases', () => {



    test('GET /projects/9999 should return 401 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });


    test('GET /projects?start=99999 should return 404 if it finds nothing after the given offset', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects?start=99999').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });



    test('GET /projects?count=as should return 400 if parameters are of wrong type', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects?count=as').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('GET /projects?start=as should return 400 if parameter is of wrong type', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects?start=as').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });
/*
    test('GET /projects?query=d1s+]2sda should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects?query=d1s+]2sda').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });*/

    test('POST /projects/ should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects').send(notValidExampleForInsert1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('POST /projects/ should return 400 if mandatory field is empty string', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects').send(notValidExampleForInsert2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


    test('PUT /projects/2 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/2').send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('PUT /projects/9999 should return 401 if projects is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/9999').send(validExample2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('DELETE /projects/abc should return 400 if id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('DELETE /projects/9999 should return 401 if projects is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });
/*
    test('GET /projects/1 should return 401 if user isn\'t project\'s owner', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/1').set('Authorization', validTokenId2);
        expect(response.status).toBe(401)
    });

*/
/*
    test('DELETE /projects/1 should return 401 if user isn\'t project\'s owner', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/1').set('Authorization', validTokenId2);
        expect(response.status).toBe(401);
    });
    */


    test('POST /projects/1/share should return 400 if the email isn\'t valid', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/1/share').send(notValidEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('POST /projects/1/share should return 400 if the shared user is already present in this project', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/1/share').send(validEmail2).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('POST /projects/1/deleteShare should return 400 if the shared user with this email isn\'t exist in DB', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/1/deleteShare').send(notExistEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('POST /projects/1/deleteShare should return 400 if the shared user isn\'t present in this project', async () => {
        jest.setTimeout(10000);
        response = await request(app).post('/projects/2/deleteShare').send(validEmail).set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });


});