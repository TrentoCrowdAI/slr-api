const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

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
    "manual":"0",
    "doi": "abcdefg"
};

let validExampleForPost1 = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"],
    "project_id": 1
};

let validExampleForPost2 = {
    "paper": validExample,
    "project_id": 1
};


const validTokenId = "test";



/* good cases*/
describe('good cases on projectPapers ', () => {

    test('POST /papers should return 201(on eid array)', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/papers').send(validExampleForPost1).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);
        //let result = await response.body;
    });

    test('POST /customPapers should return 201(on paper object)', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/customPapers').send(validExampleForPost2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /papers/1 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/papers/1').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/2 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/papers/2').set('Authorization', validTokenId);
        expect(response.status).toBe(204);
    });


    test('GET /papers?project_id=1 should return 200 if it finds something', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers?project_id=1').set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });



});



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

let notValidExampleForPost = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"],
};
let notValidExampleForPost2 = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"],
    "project_id": "abc"
};
let notValidExampleForPost3 = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"],
    "project_id": 1.45
};
let notValidExampleForPost4 = {
    "arrayEid": 1,
    "project_id": 1
};
let notValidExampleForPost5 = {
    "arrayEid": [],
    "project_id": 1
};

let notValidExampleForCustomPost = {
    "paper": validExample,

};
let notValidExampleForCustomPost2 = {
    "paper": validExample,
    "project_id": 1.5
};
let notValidExampleForCustomPost3 = {
    "paper": validExample,
    "project_id": "abc"
};
let notValidExampleForCustomPost4 = {
    "paper": notValidExampleForUpdate,
    "project_id": 1
};



/*bad cases*/
describe('bad cases on projectPapers ', () => {


    test('POST /papers should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/papers').send(notValidExampleForPost).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForPost2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForPost3).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForPost4).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForPost5).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });


    test('POST /customPapers should return 400 if parameters are not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/papers').send({}).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForCustomPost).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForCustomPost2).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForCustomPost3).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/papers').send(notValidExampleForCustomPost4).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('PUT /papers should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/papers/1.5').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/papers/abc').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).put('/papers/3').send(notValidExampleForUpdate).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('PUT /papers should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).put('/papers/99999').send(validExample).set('Accept', 'application/json').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });



    test('DELETE /papers should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/papers/abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).delete('/papers/3.55').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
    });

    test('DELETE /papers should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).delete('/papers/9999').set('Authorization', validTokenId);
        expect(response.status).toBe(404);
    });


    test('GET /papers should return 400 if parameters have illegal value', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=abc').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1.5').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&orderBy=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&sort=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&start=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&start=-1').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&count=abcde').set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).get('/papers?project_id=1&count=0').set('Authorization', validTokenId);
        expect(response.status).toBe(400);


    });


    test('GET /papers should return 401 if the project doesn\'t exist or user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers?project_id=99999').set('Authorization', validTokenId);
        expect(response.status).toBe(401)
    });

    test('GET /papers should return 404 if the result is empty', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/papers?project_id=5').set('Authorization', validTokenId);
        expect(response.status).toBe(404)
    });








});