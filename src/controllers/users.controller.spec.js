const request = require('supertest');
const app = require(__base + 'app');

//not valid example
var notValidExampleForLogin = {"tokenId" : "A"};

const notValidTokenId = "654321";


test('dummy test', () => {
    expect(true).toBe(true);
});

/*bad cases*/
describe('bad cases', () => {


    test('POST /auth/login should return 400 if mandatory field is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/auth/login').send({}).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('POST /auth/login should return 400 if token is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/auth/login').send(notValidExampleForLogin).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('GET /projects should return 400 if user isn\'t login', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects').set('Authorization', "null");
        expect(response.status).toBe(400);
    });

    test('GET /projects should return 400 if desn\'t exist the user with this token_id', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects').set('Authorization', notValidTokenId);
        expect(response.status).toBe(400);
    });


});