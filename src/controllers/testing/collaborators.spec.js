const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

/* *
* collaborators
* range of usable data n° 91 ~ 105
* 91~95 for controller layer
* */

const index = 91;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 =  index + 4;
const validTokenId = "test"+index;
const validTokenId2 = "test"+index2;
const validTokenId3 = "test"+index3;
const validTokenId4 = "test"+index4;
const validTokenId5 = "test"+index5;


/* good cases=====================================================================================================*/

const validExample = {"email": "test" + index2 + "@gmail.com"};


describe('good cases on collaborators', () => {


    test('GET /projects/:id/collaborators should return 200', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects/' + index + '/collaborators').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('POST /projects/:id/collaborators should return 201', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/projects/' + index + '/collaborators').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });

    test('DELETE /projects/:id/collaborators/:user_id should return 204', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).delete('/projects/' + index + '/collaborators/' + index2).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


});


/* bad cases==============================================================================================================*/


const notValidEmail = {"email": "notValid@com"};


/*bad cases*/
describe('bad cases on collaborators', () => {

    describe('bad cases on POST /projects/:id/collaborators', () => {

        test('POST /projects/:id/collaborators should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //project id is not number
            let response = await request(app).post('/projects/abc/collaborators').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //project id is not integer
            response = await request(app).post('/projects/' + index + '.5/collaborators').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //post body is empty
            response = await request(app).post('/projects/' + index + '/collaborators').send({}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //body.email is not valid
            response = await request(app).post('/projects/' + index + '/collaborators').send(notValidEmail).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('POST /projects/:id/collaborators should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);

            //project is not exist
            let response = await request(app).post('/projects/9999/collaborators').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('POST /projects/:id/collaborators should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);

            let response = await request(app).post('/projects/' + index3 + '/collaborators').send(validExample).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('POST /projects/:id/collaborators should return 400 if the shared user is already present in this project', async () => {
            jest.setTimeout(timeOut);

            //test data
            let notValidExampleForJustPresent = {"email": "test" + index + "@gmail.com"};

            let response = await request(app).post('/projects/' + index + '/collaborators').send(notValidExampleForJustPresent).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

    });


    describe('bad cases on DELETE /projects/:id/collaborators/:user_id', () => {

        test('DELETE /projects/:id/collaborators/:user_id should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //project id is not number
            let response = await request(app).delete('/projects/abc/collaborators/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //project id is not integer
            response = await request(app).delete('/projects/'+index+'.5/collaborators/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //user id is not number
            response = await request(app).delete('/projects/'+index+'/collaborators/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //user id is not integer
            response = await request(app).delete('/projects/1/collaborators/'+index+'.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('DELETE /projects/:id/collaborators/:user_id should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/projects/9999/collaborators/'+index).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('DELETE /projects/:id/collaborators/:user_id should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).delete('/projects/'+index2+'/collaborators/'+index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });


        test('DELETE /projects/:id/collaborators/:user_id should return 400 if the user_id isn\'t among the collaborators', async () => {
            jest.setTimeout(timeOut);
            response = await request(app).delete('/projects/'+index+'/collaborators/'+index2).set('Authorization', validTokenId);
            
            expect(response.status).toBe(400);
        });

    });


    describe('bad cases GET /projects/:id/collaborators', () => {

        test('GET /projects/:id/collaborators should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);

            //project id is not number
            let response = await request(app).get('/projects/abc/collaborators').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //project id is not integer
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
            let response = await request(app).get('/projects/'+index3+'/collaborators').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

    });
});