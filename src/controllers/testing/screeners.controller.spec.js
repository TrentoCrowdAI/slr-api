const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");

//the config file
const config = require(__base + 'config');


/* *
* screeners
* range of usable data n° 136~ 150
* 136~140 for controller layer
* */


const index = 136;
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


describe('good cases on projects', () => {


    test('GET /projects/:project_id/screeners should return 200', async () => {

        let response = await request(app).get('/projects/' + index + '/screeners').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST /projects/:project_id/screeners should return 201', async () => {


        let validExample = {
            "array_user_ids": [index2],
            "manual_screening_type": config.manual_screening_type.single_predicate,
        };

        response = await request(app).post('/projects/' + index + '/screeners').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });

    test('PUT /projects/:project_id/screeners should return 201', async () => {


        let validExample = {
            "array_user_ids": [index3],
        };

        response = await request(app).put('/projects/' + index + '/screeners').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });


});


/* bad cases==============================================================================================================*/
let validExampleForPost = {
    "array_user_ids": [index],
    "manual_screening_type": config.manual_screening_type.single_predicate,
};

let validExampleForPut = {
    "array_user_ids": [index4],
};

describe('bad cases on projects', () => {


    describe('bad cases on GET /projects/:project_id/screeners', () => {

        test('GET /projects/:project_id/screeners should return 400 if parameters aren\'t valid', async () => {

            //if the project id is not a number
            let response = await request(app).get('/projects/abc/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //if the project id is not a integer
            response = await request(app).get('/projects/' + index + '.5' + '/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('GET /projects/:project_id/screeners should return 401 if it finds nothing', async () => {

            let response = await request(app).get('/projects/9999/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('GET /projects/:project_id/screeners should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).get('/projects/' + index + '/screeners').set('Authorization', validTokenId5);
            expect(response.status).toBe(401);
        });

    });


    describe('bad cases on POST /projects/:project_id/screeners', () => {


        test('POST /projects/:project_id/screeners should return 400 if parameters aren\'t valid', async () => {


            //the project id is not a number
            let response = await request(app).post('/projects/abc/screeners').send(validExampleForPost).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

            //the project id is not a integer
            response = await request(app).post('/projects/' + index2 + '.5/screeners').send(validExampleForPost).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

            //the array user ids is not exist
            let notValidExampleForArrayNotExist = {
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForArrayNotExist).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

            //the array user ids is empty
            let notValidExampleForArrayEmpty = {
                "array_user_ids": [],
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForArrayEmpty).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

            //the array user ids contains the element not integer
            let notValidExampleForArrayNotInteger = {
                "array_user_ids": ["abc", "dfv"],
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForArrayNotInteger).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

            //the manual screening type is not valid
            let notValidExampleForManualTypeNotValid = {
                "array_user_ids": [index],
                "manual_screening_type": "abc"
            };
            response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForManualTypeNotValid).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);

        });


        test('POST /projects/:project_id/screeners should return 401 if it finds nothing', async () => {


            let response = await request(app).post('/projects/9999/screeners').send(validExampleForPost).set('Authorization', validTokenId2);
            expect(response.status).toBe(401);
        });


        test('POST /projects/:project_id/screeners should return 401 if user hasn\'t permission', async () => {


            let response = await request(app).post('/projects/' + index2 + '/screeners').send(validExampleForPost).set('Authorization', validTokenId5);
            
            expect(response.status).toBe(401);
        });

        test('POST /projects/:project_id/screeners should return 400 if user isn\'t exist', async () => {


            let notValidExampleForUserNotExist = {
                "array_user_ids": ["9999"],
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            let response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForUserNotExist).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);
        });

        test('POST /projects/:project_id/screeners should return 400 if user isn\'t collaborator', async () => {


            let notValidExampleForNotCollaborator = {
                "array_user_ids": [index3],
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            let response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForNotCollaborator).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);
        });


        test('POST /projects/:project_id/screeners should return 400 if the shared user is already present in this project', async () => {


            let notValidExampleForAlreadyExist = {
                "array_user_ids": [index2],
                "manual_screening_type": config.manual_screening_type.single_predicate,
            };
            response = await request(app).post('/projects/' + index2 + '/screeners').send(notValidExampleForAlreadyExist).set('Authorization', validTokenId2);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on PUT /projects/:project_id/screeners', () => {

        test('PUT /projects/:project_id/screeners should return 400 if parameters aren\'t valid', async () => {




            //the project id is not a number
            let response = await request(app).put('/projects/abc/screeners').send(validExampleForPut).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a integer
            response = await request(app).put('/projects/' + index + '.5/screeners').send(validExampleForPut).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the user ids is not exist
            response = await request(app).put('/projects/' + index + '/screeners').send({}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the  user id is not number
            let notValidExampleForNotNumber = {
                "array_user_ids": ["abc"],
            };
            response = await request(app).put('/projects/' + index + '/screeners').send(notValidExampleForNotNumber).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the user id is not integer
            let notValidExampleNotInteger = {
                "array_user_ids": [index4 + ".5"],
            };
            response = await request(app).put('/projects/' + index + '/screeners').send(notValidExampleNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });


        test('PUT /projects/:project_id/screeners should return 401 if it finds nothing', async () => {

            let response = await request(app).put('/projects/9999/screeners').send(validExampleForPut).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('PUT /projects/:project_id/screeners should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).put('/projects/' + index + '/screeners').send(validExampleForPut).set('Authorization', validTokenId5);
            expect(response.status).toBe(401);
        });

        test('PUT /projects/:project_id/screeners should return 400 if user isn\'t exist', async () => {


            let notValidExample = {
                "array_user_ids": [9999],
            };
            let response = await request(app).put('/projects/' + index + '/screeners').send(notValidExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('PUT /projects/:project_id/screeners should return 400 if the project is not yet initialized for manual screening', async () => {


            let validExample = {
                "array_user_ids": [index],
            };
            let response = await request(app).put('/projects/' + index3 + '/screeners').send(validExample).set('Authorization', validTokenId3);

            expect(response.status).toBe(400);
        });

        test('PUT /projects/:project_id/screeners should return 400 if user isn\'t collaborator', async () => {


            let notValidExample = {
                "array_user_ids": [index5],
            };
            let response = await request(app).put('/projects/' + index + '/screeners').send(notValidExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('PUT /projects/:project_id/screeners should return 400 if the shared user is already present in this project', async () => {


            let notValidExample = {
                "array_user_ids": [index2],
            };
            response = await request(app).put('/projects/' + index + '/screeners').send(notValidExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

});