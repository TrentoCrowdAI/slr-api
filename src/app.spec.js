const request = require('supertest');


const app = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});


// same as above but using supertest
test('GET / should return 200 (using supertest)', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

