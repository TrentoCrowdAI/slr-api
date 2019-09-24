const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");

/* *
 * filters
 * range of usable data n° 1 ~ 15
 * 1~5 for controller layer
 * */


const index = 1;
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
let validExample = {
    "project_id": index,
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};
// valid examples
let validExampleUpdate = {
    "predicate": "aaa",
    "inclusion_description": "bbb",
    "exclusion_description": "ccc",
};


describe('good cases on filters ', () => {

    test('GET /filters should return 200 if it finds something', async () => {

        let response = await request(app).get('/filters?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST /filters should return 201', async () => {

        let response = await request(app).post('/filters').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);

        expect(response.status).toBe(201);

    });

    test('GET /filters/:id should return 200 if it finds something', async () => {

        let response = await request(app).get('/filters/' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('PUT /filters/:id should return 204', async () => {

        let response = await request(app).put('/filters/' + index).send(validExampleUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /filters/:id should return 204', async () => {

        let response = await request(app).delete('/filters/' + index5).set('Authorization', validTokenId5);
        expect(response.status).toBe(204);
    });


});

/* bad cases==============================================================================================================*/


/*bad cases*/
describe('bad cases on filters ', () => {

    describe('bad cases on GET /filters/', () => {

        test('GET /filters should return 400 if parameters are not valid', async () => {


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

            let response = await request(app).get('/filters?project_id=99999').set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /filters should return 401 if the user hasn\'t permission', async () => {

            let response = await request(app).get('/filters?project_id=' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /filters should return 404 if the result is empty', async () => {

            let response = await request(app).get('/filters?project_id=' + index5).set('Authorization', validTokenId5);
            expect(response.status).toBe(404)
        });

    });

    describe('bad cases on POST /filters', () => {

        test('POST /filters should return 400 if parameters are not valid', async () => {


            //the project id is missing
            let notValidExampleForProjectId = {
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            let response = await request(app).post('/filters').send(notValidExampleForProjectId).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a number
            let notValidExampleForProjectIdNotNumber = {
                "project_id": "abc",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            response = await request(app).post('/filters').send(notValidExampleForProjectIdNotNumber).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


            //the project id is not a integer
            let notValidExampleForProjectIdNotInteger = {
                "project_id": "1.5",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            response = await request(app).post('/filters').send(notValidExampleForProjectIdNotInteger).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the mandatory field  "exclusion_description" is missing
            let notValidExampleForExclusionDescription = {
                "project_id": index + "",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                }
            };
            response = await request(app).post('/filters').send(notValidExampleForExclusionDescription).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });

        test('POST /filters should return 401 if the project doesn\'t exist', async () => {


            let notValidExampleForProjectIdNotExist = {
                "project_id": "9999",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };

            let response = await request(app).post('/filters').send(notValidExampleForProjectIdNotExist).set('Authorization', validTokenId);

            expect(response.status).toBe(401);
        });

        test('POST /filters should return 401 if user hasn\'t permission', async () => {


            let notValidExampleForProjectIdNotPermission = {
                "project_id": index2 + "",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };

            let response = await request(app).post('/filters').send(notValidExampleForProjectIdNotPermission).set('Authorization', validTokenId);
            expect(response.status).toBe(401);

        });

    });

    describe('bad cases on PUT /filters/:id', () => {

        test('PUT /filters/:id should return 400 if parameters are not valid', async () => {


            //filter id is not number
            let response = await request(app).put('/filters/abc').send(validExampleUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
            response = await request(app).put('/filters/' + index + '.5').send(validExampleUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the mandatory field  "exclusion_description" is missing
            let notValidExampleForExclusionDescription = {
                "predicate": "aaa",
                "inclusion_description": "bbb",
            };
            response = await request(app).put('/filters/' + index).send(notValidExampleForExclusionDescription).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });

        test('PUT /filters/:id should return 404 if filter is not present', async () => {

            let response = await request(app).put('/filters/99999').send(validExampleUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });


        test('PUT /filters/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).put('/filters/' + index2).send(validExampleUpdate).set('Authorization', validTokenId);

            expect(response.status).toBe(401)
        });

    });

    describe('bad cases on DELETE /filters/:id', () => {

        test('DELETE /filters/:id should return 400 if parameters are not valid', async () => {


            //filter id is not number
            let response = await request(app).delete('/filters/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
            response = await request(app).delete('/filters/' + index + '.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('DELETE /filters should return 404 if filter is not present', async () => {

            let response = await request(app).delete('/filters/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('DELETE /filters/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).delete('/filters/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });

    describe('bad cases on GET /filters/:id', () => {

        test('GET /filters/:id should return 400 if parameters are not valid', async () => {


            //filter id is not number
            let response = await request(app).get('/filters/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //filter id is not integer
            response = await request(app).get('/filters/3.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('GET /filters/:id should return 404 if filter is not present', async () => {

            let response = await request(app).get('/filters/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });


        test('GET /filters/:id should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).get('/filters/' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

    });


});