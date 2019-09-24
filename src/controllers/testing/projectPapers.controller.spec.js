const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");

//the config file
const config = require(__base + 'config');


/* *
 * projectPapers
 * range of usable data n° 46~ 60
 * 46~50 for controller layer
 * */


const index = 46;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validTokenId = "test" + index;
const validTokenId2 = "test" + index2;
const validTokenId3 = "test" + index3;
const validTokenId4 = "test" + index4;
const validTokenId5 = "test" + index5;

// valid examples
let validExample = {
    "authors": "aa",
    "title": "aaa",
    "year": "2099",
    "date": "2099-12-12",
    "source_title": "aaa",
    "link": "https://www.scopus.com/",
    "abstract": "abc",
    "document_type": "Article",
    "source": "Scopus",
    "eid": "111",
    "abstract_structured": "1",
    "filter_oa_include": "1",
    "filter_study_include": "0",
    "notes": "",
    "manual": "0",
    "doi": "abcdefg"
};


beforeEach(() => {
    jest.setTimeout(timeOut);
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});


/* good cases=====================================================================================================*/


describe('good cases on projectPapers ', () => {


    describe('good cases on projectPapers GET /papers ', () => {

        test('GET /papers?project_id=' + index + ' should return 200 if it finds something', async () => {

            let response = await request(app).get('/papers?project_id=' + index).set('Authorization', validTokenId);
            expect(response.status).toBe(200);
        });

        test('GET /papers?project_id=' + index + '&type=all should return 200 if it finds something', async () => {

            let response = await request(app).get('/papers?project_id=' + index + '&type=' + config.screening_status.all).set('Authorization', validTokenId);
            expect(response.status).toBe(200);
        });

        test('GET /papers?project_id=' + index + '&type=backlog should return 200 if it finds something', async () => {

            let response = await request(app).get('/papers?project_id=' + index + '&type=' + config.screening_status.backlog).set('Authorization', validTokenId);
            expect(response.status).toBe(200);
        });

        test('GET /papers?project_id=' + index2 + '&type=manual should return 200 if it finds something', async () => {

            let response = await request(app).get('/papers?project_id=' + index2 + '&type=' + config.screening_status.manual).set('Authorization', validTokenId2);
            expect(response.status).toBe(200);
        });

        test('GET /papers?project_id=' + index3 + '&type=screened should return 200 if it finds something', async () => {

            let response = await request(app).get('/papers?project_id=' + index3 + '&type=' + config.screening_status.screened).set('Authorization', validTokenId3);
            expect(response.status).toBe(200);
        });

    });


    test('POST /papers should return 201(on eid array)', async () => {


        let validExampleForPost1 = {
            "arrayEid": ["2-s2.0-85054397290", "2-s2.0-85062937533"],
            "project_id": index
        };

        let response = await request(app).post('/papers').send(validExampleForPost1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });

    test('POST /customPapers should return 201(on paper object)', async () => {


        let validExampleForPost2 = {
            "paper": validExample,
            "project_id": index
        };
        let response = await request(app).post('/customPapers').send(validExampleForPost2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });


    test('PUT /papers/:id should return 204 if projectPaper exists', async () => {

        let response = await request(app).put('/papers/' + index).send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/:id should return 204 if projectPaper exists', async () => {

        let response = await request(app).delete('/papers/' + index5).set('Authorization', validTokenId5);
        expect(response.status).toBe(204);
    });


});

/* bad cases==============================================================================================================*/


//not valid examples
let notValidExampleForUpdate = {
    "Authors": "Momeni M., oshinfard F.",
    "Title": "Older adults experiences of ocal study",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inw4a",
    "Abstract": "Introduce communication.",
    "Document Type": "Article",
    "Source": "Scopus",
    "EID": "2-s2.0-85044209383",
    "abstract_structured": "1",
    "filter_OA_include": "1",
    "filter_study_include": "0",
    "notes2": "",
    "doi": "abcdefg"
};


/*bad cases*/
describe('bad cases on projectPapers ', () => {

    describe('bad cases on projectPapers POST /papers ', () => {

        test('POST /papers should return 400 if parameters are not valid', async () => {


            //project id missing
            let notValidExampleForProjectIdMissing = {
                "arrayEid": ["2-s2.0-85061275657", "2-s2.0-85063571192"],
            };
            let response = await request(app).post('/papers').send(notValidExampleForProjectIdMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //project id is not number
            let notValidExampleForProjectIdNotNumber = {
                "arrayEid": ["2-s2.0-85061275657", "2-s2.0-85063571192"],
                "project_id": "abc"
            };
            response = await request(app).post('/papers').send(notValidExampleForProjectIdNotNumber).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //project id is not integer
            let notValidExampleForProjectIdNotInteger = {
                "arrayEid": ["2-s2.0-85061275657", "2-s2.0-85063571192"],
                "project_id": "1.45"
            };
            response = await request(app).post('/papers').send(notValidExampleForProjectIdNotInteger).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //arrayEid is not a array
            let notValidExampleForArrayEidNotArray = {
                "arrayEid": "1",
                "project_id": "1"
            };
            response = await request(app).post('/papers').send(notValidExampleForArrayEidNotArray).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //arrayEid is empty array
            let notValidExampleForArrayEidEmpty = {
                "arrayEid": [],
                "project_id": "1"
            };
            response = await request(app).post('/papers').send(notValidExampleForArrayEidEmpty).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /customPapers should return 400 if parameters are not valid', async () => {


            //the post body is empty
            let response = await request(app).post('/papers').send({}).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is missing
            let notValidExampleCustomPostForProjectIdMissing = {
                "paper": validExample,
            };
            response = await request(app).post('/papers').send(notValidExampleCustomPostForProjectIdMissing).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not a number
            let notValidExampleCustomPostForProjectIdNotInteger = {
                "paper": validExample,
                "project_id": "1.5"
            };
            response = await request(app).post('/papers').send(notValidExampleCustomPostForProjectIdNotInteger).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project id is not number
            let notValidExampleCustomPostForProjectIdNotNumber = {
                "paper": validExample,
                "project_id": "abc"
            };
            response = await request(app).post('/papers').send(notValidExampleCustomPostForProjectIdNotNumber).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the paper of post body is not valid
            let notValidExampleCustomPostForPaperBodyNotValid = {
                "paper": notValidExampleForUpdate,
                "project_id": "1"
            };
            response = await request(app).post('/papers').send(notValidExampleCustomPostForPaperBodyNotValid).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });

    });

    describe('bad cases on projectPapers PUT /papers ', () => {

        test('PUT /papers should return 400 if mandatory field is not valid', async () => {


            //the projectPaper id is not a number
            let response = await request(app).put('/papers/abc').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the projectPaper id is not a integer
            response = await request(app).put('/papers/' + index + '.5').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the paper of post body is not valid
            response = await request(app).put('/papers/' + index).send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('PUT /papers should return 404 if projectPaper is not present', async () => {

            let response = await request(app).put('/papers/99999').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });
    });

    describe('bad cases on projectPapers DELETE /papers ', () => {


        test('DELETE /papers should return 400 if mandatory field is not valid', async () => {

            //the projectPaper id is not a number
            let response = await request(app).delete('/papers/abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the projectPaper id is not a integer
            response = await request(app).delete('/papers/' + index + '.55').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });

        test('DELETE /papers should return 404 if projectPaper is not present', async () => {


            let response = await request(app).delete('/papers/99999').set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });
    });

    describe('bad cases on projectPapers GET /papers ', () => {

        test('GET /papers should return 400 if parameters have not valid value', async () => {


            //the project id is missing
            let response = await request(app).get('/papers').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a number
            response = await request(app).get('/papers?project_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project id is not a integer
            response = await request(app).get('/papers?project_id=' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the orderBy is not valid
            response = await request(app).get('/papers?project_id=' + index + '&orderBy=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the sort is not valid
            response = await request(app).get('/papers?project_id=' + index + '&sort=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is not number
            response = await request(app).get('/papers?project_id=' + index + '&start=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the start is less than 0
            response = await request(app).get('/papers?project_id=' + index + '&start=-1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is not a number
            response = await request(app).get('/papers?project_id=' + index + '&count=abcde').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the count is less than 1
            response = await request(app).get('/papers?project_id=' + index + '&count=0').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the type is not valid
            response = await request(app).get('/papers?project_id=' + index + '&type=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the min confidence is not a number
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&min_confidence=a').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is less than 0
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&min_confidence=-0.1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the min confidence is greater than 1
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&min_confidence=1.1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the max confidence is not a number
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&max_confidence=a').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the max confidence is less than 0
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&max_confidence=-0.1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the max confidence is greater than 1
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&max_confidence=1.1').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the min confidence is greater than max confidence
            response = await request(app).get('/papers?project_id=' + index + '&type=backlog&min_confidence=0.8&max_confidence=0.6').set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('GET /papers should return 401 if the project isn\'t exist', async () => {

            let response = await request(app).get('/papers?project_id=99999').set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /papers should return 401 if the user hasn\'t permission', async () => {

            let response = await request(app).get('/papers?project_id=' + index2).set('Authorization', validTokenId);
            expect(response.status).toBe(401)
        });

        test('GET /papers should return 404 if the result is empty', async () => {

            let response = await request(app).get('/papers?project_id=' + index5).set('Authorization', validTokenId5);
            expect(response.status).toBe(404)
        });
    });

});