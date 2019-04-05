const request = require('supertest');
const app = require(__base + 'app');


// valid examples
var validExample = {
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
    "notes": ""

};

var validExampleForPost = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"],
    "project_id": 1
};

//not valid examples
var notValidExampleForUpdate = {
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
    "notes2": ""
};

var notValidExampleForPost1 = {
    "arrayEid": ["2-s2.0-85058217031", "2-s2.0-85050101553"]
};
var notValidExampleForPost2 = {
    "arrayEid": 1,
    "project_id": 1
};


test('dummy test', () => {
    expect(true).toBe(true);
});

/* good cases*/
describe('good cases', () => {


    test('GET /papers?project_id=1 should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1');
        expect(response.status).toBe(200);
    });

    test('GET /papers?project_id=1&start=3 should return 200 if it has correct pagination params and finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&start=3');
        expect(response.status).toBe(200);
    });


    test('GET /papers?project_id=1&query=a should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&query=a');
        expect(response.status).toBe(200);
    });

    test('GET /papers/1 should return 200 if projectPaper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/1');
        expect(response.status).toBe(200);
    });

    test('POST /papers should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(validExampleForPost).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /papers/1 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/1').send(validExample).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/2 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/papers/2');
        expect(response.status).toBe(204);
    });

});






/*bad cases*/
describe('bad cases', () => {

    test('GET /papers?project_id=99999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=99999');
        expect(response.status).toBe(404)
    });

    test('GET /papers?project_id=1&start=-1 should return 400 if it has wrong pagination parameters', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&start=-1');
        expect(response.status).toBe(400);
    });

    test('GET /papers?project_id=1&after=99999 should return 404 if there are no papers after the id', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&start=99999');
        expect(response.status).toBe(404);
    });


    test('GET /papers?project_id=1&count=0 should return 400 if count < 1', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&count=0');
        expect(response.status).toBe(400);
    });

    test('GET /papers?project_id=1&query=zazaxsfsdaxa should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&query=zazaxsfsdaxa');
        expect(response.status).toBe(404);
    });

    test('GET /papers?project_id=1&start=as should return 400 if parameters are of wrong type', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&start=as');
        expect(response.status).toBe(400);
    });

    test('GET /papers/99999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/99999');
        expect(response.status).toBe(404)
    });


    test('POST /papers should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(notValidExampleForPost1).set('Accept', 'application/json');;
        expect(response.status).toBe(400);
    });

    test('POST /papers should return 400 if mandatory field has wrong type', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(notValidExampleForPost2).set('Accept', 'application/json');;
        expect(response.status).toBe(400);
    });


    test('PUT /papers/3 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/3').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /papers/9999 should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/99999').send(validExample).set('Accept', 'application/json');
        expect(response.status).toBe(404);
    });


    test('DELETE /papers/3.55 should return 400 if paper id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/3.55');
        expect(response.status).toBe(400);
    });

    test('DELETE /papers/9999 should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/9999');
        expect(response.status).toBe(404);
    });


});