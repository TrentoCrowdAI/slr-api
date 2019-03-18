const request = require('supertest');
const app = require(__base + 'app');

// valid examples
var validExample1 = {"Authors": "aa",
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
// valid examples
var validExample2 = {
    "Authors": "Momeni M., Hariri N., Nobahar M., Noshinfard F.",
    "Title": "Older adults experiences of onlin",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inwar",
    "Abstract": "Introduction: Online social.",
    "Document Type": "Article",
    "Source": "Scopus",
    "EID": "2-s2.0-85044209383",
    "abstract_structured": "1",
    "filter_OA_include": "1",
    "filter_study_include": "0",
    "notes": ""
};

//not valid examples
var notValidExampleForInsert = {
    "Authors": "Momeni infard F.",
    "Title": "Older adults expomenological study",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inward/recob8d226bde6114a2e524a",
    "Document Type": "Article",
    "Source": "Scopus",
    "EID": "2-s2.0-85044209383",
    "abstract_structured": "1",
    "filter_OA_include": "1",
    "filter_study_include": "0",
    "notes": ""
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



test('dummy test', () => {
    expect(true).toBe(true);
});

/* good cases*/
describe('good cases', () => {


    test('GET /projects/1/papers should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/1/papers');
        expect(response.status).toBe(200);
    });

    test('GET /projects/1/papers/1 should return 200 and paper if projectPaper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/1/papers/1');
        expect(response.status).toBe(200);
    });

    test('POST /projects/2/papers/5 should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects/5/papers/5').send(validExample1).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });


    test('PUT /projects/1/papers/1 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/1/papers/1').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /projects/1/papers/1 should return 204 if projectPaper exists', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/projects/1/papers/1');
        expect(response.status).toBe(204);
    });

});






/*bad cases*/
describe('bad cases', () => {


    test('GET /projects/9999/papers/9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/projects/9999/papers/9999');
        expect(response.status).toBe(404)
    });


    test('POST /projects/1/papers/99 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/projects/1/papers/99').send(notValidExampleForInsert).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });


    test('PUT /projects/1/papers/2 should return 400 if mandatory field is not valid', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/1/papers/2').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /projects/1/papers/100 should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/projects/1/papers/100').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(404);
    });


    test('DELETE /projects/1/papers/3.55 should return 400 if paper id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/1/papers/3.55');
        expect(response.status).toBe(400);
    });

    test('DELETE /projects/1/papers/9999 should return 404 if projectPaper is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/projects/1/papers/9999');
        expect(response.status).toBe(404);
    });


});