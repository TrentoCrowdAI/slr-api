const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

const validTokenId = "test";
const notValidTokenId = "654321";



/*bad cases*/
describe('bad cases on users', () => {

    /*
     test('POST /auth/login should return 400 if mandatory field is not present', async () => {
     jest.setTimeout(timeOut);
     let response = await request(app).post('/auth/login').send({}).set('Accept', 'application/json');
     expect(response.status).toBe(400);
     });

     test('POST /auth/login should return 400 if token is not valid', async () => {
     jest.setTimeout(timeOut);
     let response = await request(app).post('/auth/login').send(notValidExampleForLogin).set('Accept', 'application/json');
     expect(response.status).toBe(400);
     });
     */
    test('GET /projects should return 400 if user \'s token is miss', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects');
        expect(response.status).toBe(400);
        response = await request(app).get('/projects').set('Authorization', "null");
        expect(response.status).toBe(400);
    });

    test('GET /projects should return 400 if user \'s token is not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects').set('Authorization', notValidTokenId);
        expect(response.status).toBe(400);
    });


});