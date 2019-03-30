const request = require('supertest');
const app = require(__base + 'app');


// valid examples
var validExample = {"Authors": "aa",
    "Title": "aaa",
    "Year": "2099",
    "Source title": "aaa",
    "Link": "https://www.scopus.com/",
    "Abstract": "abc",
    "Document Type": "Article",
    "Source": "Scopus",
    "EID": "111",
    "abstract_structured": "1",
    "filter_OA_include": "1",
    "filter_study_include": "0",
    "notes": ""

};

var validExampleForPost = {
    "paper_id": 1,
    "project_id": 1
}

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

var notValidExampleForPost = {
    "paper_id": 1
}



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

    test('GET /papers?project_id=1&pagesize=12 should return 200 if it has correct pagination params and finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&pagesize=12');
        expect(response.status).toBe(200);
    });

    //actually, the dao checks for elements with greater id, so maybe the element doesn't exists because it was deleted
    test('GET /papers?project_id=1&after=3 should return 200 if it finds something after ""exisiting"" given element', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&after=3');
        expect(response.status).toBe(200);
    });

    //here it's the same, the dao checks simply for elements with lower id, it doesn't bother seraching if the element at given id exists
    test('GET /papers?project_id=1&before=100 should return 200 if it finds something before ""exisiting"" given element', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&before=100');
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

    test('GET /papers?project_id=9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=9999');
        expect(response.status).toBe(404)
    });

    test('GET /papers?project_id=1&pagesize=2 should return 400 if it has wrong pagination parameters', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&pagesize=2');
        expect(response.status).toBe(400);
    });

    test('GET /papers?project_id=1&after=9822 should return 404 if there are no papers after the id', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&after=9822');
        expect(response.status).toBe(404);
    });

    test('GET /papers?project_id=1&before=1 should return 404 if it finds nothing before the given id element', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&before=1');
        expect(response.status).toBe(404);
    });

    test('GET /papers?project_id=1&before=10&after=1 should return 400 if both "after" and "before" elements are defined', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&before=10&after=1');
        expect(response.status).toBe(400);
    });

    test('GET /papers?project_id=1&before=as should return 400 if parameters are of wrong type', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers?project_id=1&before=as');
        expect(response.status).toBe(400);
    });

    test('GET /papers/9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/9999');
        expect(response.status).toBe(404)
    });


    test('POST /papers should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(notValidExampleForPost).set('Accept', 'application/json');;
        expect(response.status).toBe(400);
    });


    test('PUT /papers/3 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/3').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /papers/9999 should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/9999').send(validExample).set('Accept', 'application/json');
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