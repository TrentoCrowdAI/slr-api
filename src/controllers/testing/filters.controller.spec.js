const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;


/* range of usable data n° 1 ~ 3 */
const index = 1;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test";
const validTokenId3 = "test" + index3;

/* good cases=====================================================================================================*/

// valid examples
let validExample = {
    "project_id": "1",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};


describe('good cases on filters ', () => {

    test('GET /filters should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST /filters should return 201', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/filters').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });

    test('GET /filters/:id should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/filters/' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('PUT /filters/:id should return 204', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/filters/' + index).send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /filters/:id should return 204', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/filters/' + index3).set('Authorization', validTokenId3);
        expect(response.status).toBe(204);
    });


});

/* bad cases==============================================================================================================*/


//not valid examples
let notValidExampleForProjectId = {
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExampleForProjectIdNotNumber = {
    "project_id": "abc",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExampleForProjectIdNotInteger = {
    "project_id": "1.5",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExampleForExclustionDescription = {
    "project_id": index+"",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
};


let notValidExampleForProjectIdNotExist = {
    "project_id": "9999",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};
let notValidExampleForProjectIdNotPermission = {
    "project_id": index3+"",
    "name": "abc",
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};


/*bad cases*/
describe('bad cases on filters ', () => {

    describe('bad cases on GET /filters/', () => {

        test('GET /filters should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is missing
            let response = await request(app).get('/filters').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not number
            response = await request(app).get('/filters?project_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not integer
            response = await request(app).get('/filters?project_id=1.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/filters?project_id=1&sort=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not number
            response = await request(app).get('/filters?project_id=1&start=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/filters?project_id=1&start=-1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not number
            response = await request(app).get('/filters?project_id=1&count=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
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
            let response = await request(app).get('/filters?project_id='+index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /filters should return 404 if the result is empty', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/filters?project_id='+index3).set('Authorization', validTokenId3);
            expect(response.status).toBe(404)
        });

    });

    describe('bad cases on POST /filters', () => {

        test('POST /filters should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is missing
            let response = await request(app).post('/filters').send(notValidExampleForProjectId).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a number
            response = await request(app).post('/filters').send(notValidExampleForProjectIdNotNumber).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a integer
            response = await request(app).post('/filters').send(notValidExampleForProjectIdNotInteger).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the mandatory field is missing
            response = await request(app).post('/filters').send(notValidExampleForExclustionDescription).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });

        test('POST /filters should return 401 if the project doesn\'t exist', async () => {
            jest.setTimeout(timeOut);

            let response = await request(app).post('/filters').send(notValidExampleForProjectIdNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('POST /filters should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/filters').send(notValidExampleForProjectIdNotPermission).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });

    describe('bad cases on PUT /filters/:id', () => {

        test('PUT /filters/:id should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //filter id is not number
            let response = await request(app).put('/filters/abc').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
             response = await request(app).put('/filters/' + index + '.5').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            response = await request(app).put('/filters/' + index).send(notValidExampleForProjectId).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            response = await request(app).put('/filters/' + index).send(notValidExampleForProjectIdNotNumber).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


            response = await request(app).put('/filters/' + index).send(notValidExampleForExclustionDescription).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });

        test('PUT /filters/:id should return 404 if filter is not present', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).put('/filters/99999').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });


        test('PUT /filters/:id should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).put('/filters/' + index2).send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });

    describe('bad cases on DELETE /filters/:id', () => {

        test('DELETE /filters/:id should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //filter id is not number
            let response = await request(app).delete('/filters/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
            response = await request(app).delete('/filters/' + index + '.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('DELETE /filters should return 404 if filter is not present', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/filters/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('DELETE /filters/:id should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/filters/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });

    describe('bad cases on GET /filters/:id', () => {

        test('GET /filters/:id should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //filter id is not number
            let response = await request(app).get('/filters/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
            response = await request(app).get('/filters/3.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('GET /filters/:id should return 404 if filter is not present', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/filters/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });


        test('GET /filters/:id should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/filters/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });



});