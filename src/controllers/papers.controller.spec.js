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

var validExample2 = {
    "Authors": "Momeni M., Hariri N., Nobahar M., Noshinfard F.",
    "Title": "Older adults experiences of online social interactions: A phenomenological study",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85044209383&partnerID=40&md5=8e7d3696529db8d226bde6114a2e524a",
    "Abstract": "Introduction: Online social networks allow users, who are anywhere in the world, to communicate with other people with text, audio, and video. Studies have shown that older adults use of social networks and online communication.",
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
    "Authors": "Momeni M., Hariri N., Nobahar M., Noshinfard F.",
    "Title": "Older adults experiences of online social interactions: A phenomenological study",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85044209383&partnerID=40&md5=8e7d3696529db8d226bde6114a2e524a",
    "Document Type": "Article",
    "Source": "Scopus",
    "EID": "2-s2.0-85044209383",
    "abstract_structured": "1",
    "filter_OA_include": "1",
    "filter_study_include": "0",
    "notes": ""
};

var notValidExampleForUpdate = {
    "Authors": "Momeni M., Hariri N., Nobahar M., Noshinfard F.",
    "Title": "Older adults experiences of online social interactions: A phenomenological study",
    "Year": "2018",
    "Source title": "Koomesh",
    "Link": "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85044209383&partnerID=40&md5=8e7d3696529db8d226bde6114a2e524a",
    "Abstract": "Introduction: Online social networks allow users, who are anywhere in the world, to communicate with other people with text, audio, and video. Studies have shown that older adults use of social networks and online communication.",
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

    test('GET /search should return 200 if find any papers', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search?query=2015');
        expect(response.status).toBe(200);
    });

    test('GET /papers should return 200 if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers');
        expect(response.status).toBe(200);
    });

    test('GET /papers/20 should return 200 and paper if it finds something', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/20');
        expect(response.status).toBe(200);
    });

    test('POST  /papers/ should return 201', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(validExample1).set('Accept', 'application/json');
        expect(response.status).toBe(201);
        //let result = await response.body;
    });



    test('PUT /papers/22 should return 204 if exists the specific paper', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/22').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(204);
    });


    test('DELETE /papers/25 should return 204', async () => {
        jest.setTimeout(10000);
        response = await request(app).delete('/papers/25');
        expect(response.status).toBe(204);
    });

});






/*bad cases*/
describe('bad cases', () => {


    test('GET /search should return 400 if mandatory field is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search');
        expect(response.status).toBe(400)
    });
    test('GET /search should return 404 if no paper is found', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/search?query=uaidafha');
        expect(response.status).toBe(404)
    });
    test('GET /papers/9999 should return 404 if it finds nothing', async () => {
        jest.setTimeout(10000);
        let response = await request(app).get('/papers/9999');
        expect(response.status).toBe(404)
    });


    test('POST /papers/ should return 400 if mandatory field is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).post('/papers').send(notValidExampleForInsert).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });


    test('PUT /papers/21 should return 400 if mandatory field is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/21').send(notValidExampleForUpdate).set('Accept', 'application/json');
        expect(response.status).toBe(400);
    });

    test('PUT /papers/9999 should return 404 if papers is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).put('/papers/9999').send(validExample2).set('Accept', 'application/json');
        expect(response.status).toBe(404);
    });


    test('DELETE /papers/qqq should return 400 if id is not integer', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/qqq');
        expect(response.status).toBe(400);
    });

    test('DELETE /papers/9999 should return 404 if papers is not present', async () => {
        jest.setTimeout(10000);
        let response = await request(app).delete('/papers/9999');
        expect(response.status).toBe(404);
    });


});