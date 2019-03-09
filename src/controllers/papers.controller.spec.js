const request = require('supertest');

const app = require(__base + 'app');

test('dummy test', () => {
  expect(true).toBe(true);
})

test('GET /search should return 400 if mandatory field is not present', async () => {
  jest.setTimeout(10000);
  let response = await request(app).get('/search');
  expect(response.status).toBe(400)
});

test('GET /search should return 400 if no paper is found', async () => {
  jest.setTimeout(10000);
  let response = await request(app).get('/search?query=uaidafha');
  expect(response.status).toBe(400)
});


test('GET /papers/:id should return 200 and paper if it finds something', async () => {
  jest.setTimeout(10000);
  let response = await request(app).get('/papers/17');
  expect(response.status).toBe(200)
  expect(response.body.id).toBeDefined();
});

test('GET /papers/:id should return 404 if it finds nothing', async () => {
  jest.setTimeout(10000);
  let response = await request(app).get('/papers/0');
  expect(response.status).toBe(404)
});

/*afterAll(async done => {
  done();
});*/

// test('POST /jobs should return 400 if mandatory fields are not present', async () => {
//   let response = await request(app).post('/jobs');
//   expect(response.status).toBe(400);
// });

// test('POST /jobs should return 400 if reward is not present', async () => {
//   let wrongJob = {
//     data: {
//       name: "New job",
//       items_csv: "some/path"
//     }
//   };
//   let response = await request(app).post('/jobs').send(wrongJob);
//   expect(response.status).toBe(400);
// });

// test('POST /jobs should return 201 ad the id have to be defined if the new job is created', async () => {
//   let job = {
//     data: {
//       name: "New job",
//       reward: 0.12,
//       items_csv: "some/path"
//     }
//   };
//   let response = await request(app).post('/jobs').send(job);
//   expect(response.status).toBe(201);
//   expect(response.body.id).toBeDefined();
// });
