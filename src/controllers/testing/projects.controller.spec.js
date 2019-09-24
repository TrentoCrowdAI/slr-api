const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");


/* *
 * projects
 * range of usable data n° 31~ 45
 * 31~36 for controller layer
 * */


const index = 31;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validTokenId = "test" + index;
const validTokenId2 = "test" + index2;
const validTokenId3 = "test" + index3;
const validTokenId4 = "test" + index4;
const validTokenId5 = "test" + index5;


beforeEach(() => {
    jest.setTimeout(timeOut);
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

/* good cases=====================================================================================================*/

// valid examples
const validExample = {
    "name": "aa",
    "description": "aaa"
};


describe('good cases on projects', () => {

    test('GET /projects should return 200 if it finds something', async () => {

        let response = await request(app).get('/projects').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST  /projects should return 201', async () => {

        let response = await request(app).post('/projects').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });


    test('PUT /projects/:id should return 204 if project exists', async () => {

        let response = await request(app).put('/projects/' + index).send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /projects/:id should return 204 if project exists', async () => {

        response = await request(app).delete('/projects/' + index5).set('Authorization', validTokenId5);
        expect(response.status).toBe(204);
    });


    test('GET /projects/:id should return 200 if project exists', async () => {

        let response = await request(app).get('/projects/' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


});


/* bad cases==============================================================================================================*/


//not valid examples
const notValidExampleForDescriptionMissing = {
    "name": "aa"
};
const notValidExampleForNameMissing = {
    "description": "aaa"
};
const notValidExampleForNameEmpty = {
    "name": "",
    "description": "aaa"
};

const notValidExampleForDescriptionEmpty = {
    "name": "bb",
    "description": ""
};


describe('bad cases on projects', () => {

    describe('bad cases on GET /projects', () => {

        test('GET /projects should return 400 if parameters are not valid', async () => {


            //the orderBy is not valid
            response = await request(app).get('/projects?&orderBy=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/projects?&sort=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not a number
            response = await request(app).get('/projects?&start=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/projects?&start=-1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not a number
            response = await request(app).get('/projects?&count=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).get('/projects?&count=0').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('GET /projects should return 404 if it finds nothing after the given offset', async () => {

            let response = await request(app).get('/projects?start=99999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('GET /projects should return 404 if user hasn\'t any project', async () => {

            let response = await request(app).get('/projects').set('Authorization', validTokenId5);
            expect(response.status).toBe(404);
        });


    });

    describe('bad cases on POST /projects', () => {

        test('POST /projects/ should return 400 if parameters are not valid', async () => {


            //the name missing
            let response = await request(app).post('/projects').send(notValidExampleForNameMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the description missing
            response = await request(app).post('/projects').send(notValidExampleForDescriptionMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the name empty
            response = await request(app).post('/projects').send(notValidExampleForNameEmpty).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the description empty
            response = await request(app).post('/projects').send(notValidExampleForDescriptionEmpty).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on PUT /projects', () => {

        test('PUT /projects/:id should return 400 if parameters are not valid', async () => {


            //the project id is not a number
            let response = await request(app).put('/projects/abc').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).put('/projects/' + index + '.5').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the name missing
            response = await request(app).put('/projects/' + index).send(notValidExampleForNameMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the description missing
            response = await request(app).put('/projects/' + index).send(notValidExampleForDescriptionMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the name empty
            response = await request(app).put('/projects/' + index).send(notValidExampleForNameEmpty).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the description empty
            response = await request(app).put('/projects/' + index).send(notValidExampleForDescriptionEmpty).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });

        test('PUT /projects/:id should return 401 if projects is not present', async () => {


            let response = await request(app).put('/projects/9999').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('PUT /projects/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).put('/projects/' + index2).send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

    });

    describe('bad cases on DELETE /projects', () => {

        test('DELETE /projects/:id should return 400 if parameters are not valid', async () => {


            //the project id is not a number
            let response = await request(app).delete('/projects/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).delete('/projects/' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('DELETE /projects/:id return 401 if projects is not present', async () => {

            let response = await request(app).delete('/projects/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('DELETE /projects/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).delete('/projects/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

    });

    describe('bad cases on GET /projects/:id', () => {

        test('GET /projects/:id should return 400 if parameters are not valid', async () => {


            //the project id is not a number
            let response = await request(app).get('/projects/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).get('/projects/' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('GET /projects/:id should return 401 if it finds nothing', async () => {

            let response = await request(app).get('/projects/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /projects/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).get('/projects/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });
    });


});