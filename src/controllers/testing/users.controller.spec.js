const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");

/* *
 * users
 * range of usable data n° 76~ 90
 * 76~80 for controller layer
 * */

const index = 76;
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

/* bad cases==============================================================================================================*/

const notValidTokenId = "654321";


describe('bad cases on users', () => {


    test('GET /projects should return 400 if user \'s token is miss', async () => {

        let response = await request(app).get('/projects');
        expect(response.status).toBe(400);
        response = await request(app).get('/projects').set('Authorization', "null");
        expect(response.status).toBe(400);
    });

    test.skip('GET /projects should return 401 if user \'s token is not valid', async () => {

        let response = await request(app).get('/projects').set('Authorization', notValidTokenId);
        expect(response.status).toBe(401);
    });


});