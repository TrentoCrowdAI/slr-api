const request = require('supertest');
const app = require(__base + 'app');
//the config file
const config = require(__base + 'config');
const timeOut = 20 * 1000;


/* range of usable data n° 22 ~ 24 */
const index = 22;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId3 = "test" + index3;


/* good cases=====================================================================================================*/

const validExample = {
    "project_id": index,
    "array_user_ids": [index2],
    "manual_screening_type": config.manual_screening_type.single_predicate,
};

const validExampleForAutomatedScreening = {
    "project_id": index,
    "threshold": "0.50",
};


describe('good cases on screenings', () => {




    test('POST /screenings should return 201', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/screenings').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });


    test('DELETE /screenings should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/screenings?user_id=' + index2 + '&project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('POST /screenings/automated should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/screenings/automated').send(validExampleForAutomatedScreening).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('GET /screenings/automated should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings/automated?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('GET /screenings should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('GET /screenings/:screening_id should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings/' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


});


/* bad cases==============================================================================================================*/

const notValidExampleForProjectIdNotExist = {
    "array_user_ids": [index3],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForProjectIdNotNumber = {
    "project_id": "abc",
    "array_user_ids": [index3],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForProjectIdNotInteger = {
    "project_id": index + ".5",
    "array_user_ids": [index3],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForArrayNotExist = {
    "project_id": index,
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForArrayEmpty = {
    "project_id": index,
    "array_user_ids": [],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForArrayNotInteger = {
    "project_id": index,
    "array_user_ids": ["abc", "dfv"],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};

const notValidExampleForManualTypeNotValid = {
    "project_id": index,
    "array_user_ids": [index3],
    "manual_screening_type": "abc"

};

const notValidExampleForNothingFound = {
    "project_id": "9999",
    "array_user_ids": [index3],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};
const notValidExampleForNotPermission = {
    "project_id": index3,
    "array_user_ids": [index],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};

const notValidExampleForUserNotExist = {
    "project_id": index,
    "array_user_ids": ["9999"],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};

const notValidExampleForNotCollaborator = {
    "project_id": index3,
    "array_user_ids": [index],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};

const notValidExampleForAlreadyExist = {
    "project_id": index,
    "array_user_ids": [index],
    "manual_screening_type": config.manual_screening_type.single_predicate,

};

describe('bad cases on screenings', () => {





    describe('bad cases on POST /screenings', () => {

        test('POST /screenings should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is not exist
            let response = await request(app).post('/screenings').send(notValidExampleForProjectIdNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a number
            response = await request(app).post('/screenings').send(notValidExampleForProjectIdNotNumber).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a integer
            response = await request(app).post('/screenings').send(notValidExampleForProjectIdNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the array user ids is not exist
            response = await request(app).post('/screenings').send(notValidExampleForArrayNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the array user ids is empty
            response = await request(app).post('/screenings').send(notValidExampleForArrayEmpty).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the array user ids contains the element not integer
            response = await request(app).post('/screenings').send(notValidExampleForArrayNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the manual screening type is not valid
            response = await request(app).post('/screenings').send(notValidExampleForManualTypeNotValid).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /screenings should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings').send(notValidExampleForNothingFound).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('POST /screenings should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings').send(notValidExampleForNotPermission).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('POST /screenings should return 400 if user isn\'t exist', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings').send(notValidExampleForUserNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('POST /screenings should return 400 if user isn\'t collaborator', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings').send(notValidExampleForNotCollaborator).set('Authorization', validTokenId3);
            expect(response.status).toBe(400);
        });


        test('POST /screenings should return 400 if the shared user is already present in this project', async () => {
            jest.setTimeout(timeOut);
            response = await request(app).post('/screenings').send(notValidExampleForAlreadyExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on DELETE /screenings', () => {

        test('DELETE /screenings should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is not a number
            let response = await request(app).delete('/screenings?project_id=abc&user_id='+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).delete('/screenings?project_id='+index+'.5&user_id='+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the user id is not a number
            response = await request(app).delete('/screenings?project_id='+index+'&user_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the user id is not a integer
            response = await request(app).delete('/screenings?project_id='+index+'&user_id='+index+'.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('DELETE /screenings should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/screenings?project_id=9999&user_id='+index).set('Authorization', validTokenId);
            expect(response.status).toBe(401);

        });

        test('DELETE /screenings should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/screenings?project_id='+index3+'&user_id='+index3).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('DELETE /projects/:id/screeners/:user_id should return 400 if the user_id isn\'t among the screeners', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/screenings?project_id='+index+'&user_id='+index3).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on POST /screenings/automated', () => {

        test('POST /screenings/automated should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is not exist
            let response = await request(app).post('/screenings/automated').send({"threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a number
            response = await request(app).post('/screenings/automated').send({"project_id": "abc", "threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).post('/screenings/automated').send({"project_id": index+".5", "threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the threshold is not exist
            response = await request(app).post('/screenings/automated').send({"project_id": index}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the threshold is not a number
            response = await request(app).post('/screenings/automated').send({"project_id": index, "threshold": "abc"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the threshold is greater than 1
            response = await request(app).post('/screenings/automated').send({"project_id": index, "threshold": "1.1"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the threshold is less than 0
            response = await request(app).post('/screenings/automated').send({"project_id": index, "threshold": "-0.1"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /screenings/automated should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings/automated').send({"project_id": "9999", "threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(401);

        });

        test('POST /screenings/automated should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/screenings/automated').send({"project_id": index3, "threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });



    });


});