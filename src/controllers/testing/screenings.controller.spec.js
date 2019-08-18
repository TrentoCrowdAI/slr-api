const request = require('supertest');
const app = require(__base + 'app');
//the config file
const config = require(__base + 'config');
const timeOut = 20 * 1000;


/* *
* screenings
* range of usable data n° 106~ 120
* 106~110 for controller layer
* */


const index = 106;
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








describe('good cases on screenings', () => {

    test('GET /screenings should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


    test('POST /screenings/automated should return 204', async () => {
        jest.setTimeout(timeOut);

        const validExampleForAutomatedScreening = {
            "project_id": index,
            "threshold": "0.50",
        };
        response = await request(app).post('/screenings/automated').send(validExampleForAutomatedScreening).set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });

    test('GET /screenings/automated should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings/automated?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });



    test('GET /screenings/:screening_id should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings/' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });

    test('GET /screenings/:screening_id/next should return 200', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).get('/screenings/' + index2+'/next').set('Authorization', validTokenId2);
        expect(response.status).toBe(200);
    });




});


/* bad cases==============================================================================================================*/



describe('bad cases on screenings', () => {

    describe('bad cases on GET /screenings', () => {

        test('GET /screenings should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //the orderBy is not valid
            response = await request(app).get('/screenings?orderBy=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/screenings?sort=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not a number
            response = await request(app).get('/screenings?start=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/screenings?start=-1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not a number
            response = await request(app).get('/screenings?count=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).get('/screenings?count=0').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('GET /screenings should return 404 if it finds nothing after the given offset', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings?start=99999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('GET /screenings should return 404 if user hasn\'t any project', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings').set('Authorization', validTokenId5);
            expect(response.status).toBe(404);
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
            let response = await request(app).post('/screenings/automated').send({"project_id": index2, "threshold": "0.5"}).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });



    });

    describe('bad cases on GET /screenings/automated', () => {

        test('GET /papers should return 400 if parameters have not valid value', async () => {
            jest.setTimeout(timeOut);

            //the project id is missing
            let response = await request(app).get('/screenings/automated').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a number
            response = await request(app).get('/screenings/automated?project_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).get('/screenings/automated?project_id=' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


    });

    describe('bad cases on GET /screenings/:screening_id', () => {

        test('GET /screenings/:screening_id should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //screening id is not number
            let response = await request(app).get('/screenings/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //screening id is not integer
            response = await request(app).get('/screenings/'+index+'.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('GET /screenings/:screening_id should return 404 if screenings is not present', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings/9999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('GET /screenings/:screening_id should return 401 if user isn\'t owner of screenings', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings/'+index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });




    });


    describe('bad cases on GET /screenings/:screening_id/next', () => {

        test('GET /screenings/:screening_id/next should return 400 if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            //screening id is not number
            let response = await request(app).get('/screenings/abc/next').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //screening id is not integer
            response = await request(app).get('/screenings/'+index+'.55/next').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

        test('GET /screenings/:screening_id/next should return 404 if screenings is not present', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings/9999/next').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });

        test('GET /screenings/:screening_id/next should return 401 if user isn\'t owner of screenings', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings/'+index2+'/next').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('GET /screenings/:screening_id should return 404 if there isn\'t the projectPaper to vote in this screening', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/screenings/'+index+'/next').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });



    });

});