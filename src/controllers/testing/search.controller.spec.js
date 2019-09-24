const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");


/* *
 * search papers
 * range of usable data n° 16~ 30
 * 16~20 for controller layer
 * */

const index = 16;
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

describe('good cases on papers', () => {

    test('GET /search should return 200 if find any papers on scopus', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015&scopus=true').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('GET /search should return 200 if find any papers on arXiv', async () => {
        jest.setTimeout(15000);
        let response = await request(app).get('/search?query=2015&arXiv=true').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


});


/* bad cases==============================================================================================================*/

describe('bad cases on papers', () => {

    describe('bad cases on GET /search', () => {

        test('GET /search should return 400 if any source isn\'t defined', async () => {
            jest.setTimeout(15000);
            let response = await request(app).get('/search?query=2015').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('GET /search should return 400 if query field is not present', async () => {

            let response = await request(app).get('/search?scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400)
        });

        test('GET /search should return 400 if parameters have illegal value', async () => {


            //cases on scopus
            //the searchBy is not valid
            let response = await request(app).get('/search?query=a&searchBy=abc&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the year is not valid
            response = await request(app).get('/search?query=a&year=sdsa&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the orderBy is not valid
            response = await request(app).get('/search?query=a&orderBy=123&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/search?query=a&sort=abc&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the start is not a number
            response = await request(app).get('/search?query=a&start=abc&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/search?query=a&start=-1&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the count is not a number
            response = await request(app).get('/search?query=a&count=abc&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).get('/search?query=a&count=0&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);


            //cases on arXiv
            //the searchBy is not valid
            response = await request(app).get('/search?query=a&searchBy=abc&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the orderBy is not valid
            response = await request(app).get('/search?query=a&orderBy=123&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/search?query=a&sort=abc&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not a number
            response = await request(app).get('/search?query=a&start=abc&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/search?query=a&start=-1&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the count is not a number
            response = await request(app).get('/search?query=a&count=abc&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).get('/search?query=a&count=0&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('GET /search should return 404 if it finds nothing', async () => {
            jest.setTimeout(30000);
            //case on scopus
            let response = await request(app).get('/search?query=uaidafhhhha&scopus=true').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
            //case on arXiv
            response = await request(app).get('/search?query=uaidafhhhha&arXiv=true').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

    });


    /*similar search==============================================================================================*/
    describe('bad cases on POST /search/similar', () => {

        test('POST /search/similar should return 400 if parameters have not valid value', async () => {


            //the post body is empty
            let response = await request(app).post('/search/similar').send({}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not a number
            response = await request(app).post('/search/similar').send({
                "start": "abc", "paperData": {"title": "."}
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).post('/search/similar').send({
                "start": "-1", "paperData": {"title": "."}
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not a number
            response = await request(app).post('/search/similar').send({
                "count": "abc", "paperData": {"title": "."}
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).post('/search/similar').send({
                "count": "0", "paperData": {"title": "."}
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });
    });


    /*automated search==============================================================================================*/
    describe('bad cases on POST /search/automated', () => {

        test('POST /search/automated should return 400 if parameters have illegal value', async () => {


            //the project id is not number
            let response = await request(app).post('/search/automated').send({"project_id": "abc"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not integer
            response = await request(app).post('/search/automated').send({"project_id": index + ".5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is not a number
            response = await request(app).post('/search/automated').send({
                "project_id": index, "min_confidence": "a"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is less than 0
            response = await request(app).post('/search/automated').send({
                "project_id": index, "min_confidence": "-0.1"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is greater than 1
            response = await request(app).post('/search/automated').send({
                "project_id": index, "min_confidence": "1.1"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the max confidence is not a number
            response = await request(app).post('/search/automated').send({
                "project_id": index, "max_confidence": "a"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the max confidence is less than 0
            response = await request(app).post('/search/automated').send({
                "project_id": index, "max_confidence": "-0.1"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the max confidence is greater than 1
            response = await request(app).post('/search/automated').send({
                "project_id": index, "max_confidence": "1.1"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is greater than max confidence
            response = await request(app).post('/search/automated').send({
                "project_id": index, "min_confidence": "0.9", "max_confidence": "0.8"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not a number
            response = await request(app).post('/search/automated').send({
                "project_id": index, "start": "abc"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).post('/search/automated').send({
                "project_id": index, "start": "-1"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not a number
            response = await request(app).post('/search/automated').send({
                "project_id": index, "count": "abc"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 0
            response = await request(app).post('/search/automated').send({
                "project_id": index, "count": "0"
            }).set('Authorization', validTokenId);
            expect(response.status).toBe(400);


        });
        test('POST /search/automated should return 401 if project is not exist', async () => {
            let response = await request(app).post('/search/automated').send({"project_id": 9999}).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('POST /search/automated should return 401  if user hasn\'t permission', async () => {

            let response = await request(app).post('/search/automated').send({"project_id": index2}).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

    });


});