const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;





/* range of usable data n° 16 ~ 18 */
const index = 16;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId3 = "test" + index3;


/* bad cases==============================================================================================================*/

const notValidTokenId = "654321";


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

    test('GET /projects should return 401 if user \'s token is not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/projects').set('Authorization', notValidTokenId);
        expect(response.status).toBe(401);
    });


});