const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;


/* range of usable data n° 22 ~ 24 */
const index = 22;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId3 = "test" + index3;


/* good cases=====================================================================================================*/

const validExample = {"user_id": index2};


describe('good cases on screeners', () => {


    test('POST /projects/:id/screeners should return 201', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/projects/' + index + '/screeners').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });

    test('GET /projects/:id/screeners should return 200', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/' + index + '/screeners').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('DELETE /projects/:id/screeners/:user_id should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/projects/' + index + '/screeners/' + index2).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


});


/* bad cases==============================================================================================================*/

const notValidExampleForUserIdNotNumber = {
    "user_id": "abc"
};

const notValidExampleForUserIdNotInteger = {
    "user_id": index + ".5"
};
const notValidExampleForUserIdNotExist = {
    "user_id": "9999"
};
const notValidExampleForUserIdNotCollaborator = {
    "user_id": index3
};
const notValidExampleForUserIdJustExist = {
    "user_id": index
};



describe('bad cases on screeners', () => {


    describe('bad cases on POST /projects/:id/screeners', () => {

        test('POST /projects/:id/screeners should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is not a number
            let response = await request(app).post('/projects/abc/screeners').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a integer
            response = await request(app).post('/projects/1.5/screeners').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the user id is not a number
            response = await request(app).post('/projects/1/screeners').send(notValidExampleForUserIdNotNumber).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the user id is not a integer
            response = await request(app).post('/projects/1/screeners').send(notValidExampleForUserIdNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /projects/:id/screeners should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/projects/9999/screeners').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('POST /projects/:id/screeners should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/projects/'+index2+'/screeners').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('POST /projects/:id/screeners should return 400 if user isn\'t exist', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/projects/'+index+'/screeners').send(notValidExampleForUserIdNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('POST /projects/:id/screeners should return 400 if user isn\'t collaborator', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/projects/'+index+'/screeners').send(notValidExampleForUserIdNotCollaborator).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('POST /projects/:id/screeners should return 400 if the shared user is already present in this project', async () => {
            jest.setTimeout(timeOut);
            response = await request(app).post('/projects/'+index+'/screeners').send(notValidExampleForUserIdJustExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on DELETE /projects/:id/screeners/:user_id', () => {

        test('DELETE /projects/:id/screeners/:user_id should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //the project id is not a number
            let response = await request(app).delete('/projects/abc/screeners/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).delete('/projects/'+index+'.5/screeners/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the user id is not a number
            response = await request(app).delete('/projects/'+index+'/screeners/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the user id is not a integer
            response = await request(app).delete('/projects/'+index+'/screeners/'+index+'.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('DELETE /projects/:id/screeners/:user_id should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/projects/9999/screeners/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(401);

        });

        test('DELETE /projects/:id/screeners/:user_id should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/projects/'+index2+'/screeners/'+index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('DELETE /projects/:id/screeners/:user_id should return 400 if the user_id isn\'t among the screeners', async () => {
            jest.setTimeout(timeOut);
            response = await request(app).delete('/projects/'+index+'/screeners/'+index3).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });

    describe('bad cases on GET /projects/:id/screeners', () => {

        test('GET /projects/:id/screeners should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);
            //if the project id is not a number
            let response = await request(app).get('/projects/abc/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //if the project id is not a integer
            response = await request(app).get('/projects/'+index+'.5/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('GET /projects/:id/screeners should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/projects/9999/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('GET /projects/:id/screeners should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/projects/'+index2+'/screeners').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

    });
});