const request = require('supertest');
const app = require(__base + 'app');

const timeOut = 20 * 1000;

const validTokenId = "test";
const notValidTokenId = "654321";


const validExampleForCsv = {
    "authors": "Authors",
    "title": "Title",
    "year": "Year",
    "date": "Source title",
    "source_title": "title",
    "link": "link",
    "abstract": "abstract",
    "document_type": "document_type",
    "source": "source",
    "eid": "EID",
    "abstract_structured": "abstract_structured",
    "filter_oa_include": "filter_oa_include",
    "filter_study_include": "filter_study_include",
    "notes": "notes",
    "manual": "manual",
    "doi": "doi"
};


/*good cases on uploadFile*/
describe('good cases on uploadFile', () => {

    test('POST /upload/csv should return 201 if OK', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 1).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });

});


/*bad cases*/
describe('bad cases on uploadFile', () => {

    test('POST /upload/pdf should return 400 if the file does not exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/pdf').set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/pdf should return 400 if the file is not a pdf', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/pdf').attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 400 if parameters have invalid value', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("paper_id", 1).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/upload/csv').field("project_id", "abc").field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/upload/csv').field("project_id", "1.6").field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/upload/csv').field("project_id", 1).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);
        response = await request(app).post('/upload/csv').field("project_id", 1).field("fields", JSON.stringify({"a": "b"})).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 401 if projects is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 9999).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('POST /upload/csv should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 6).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('POST /upload/csv should return 400 if the file does not exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 1).field("fields", JSON.stringify(validExampleForCsv)).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 400 if the file is not a csv', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 1).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validPdf.pdf").set('Authorization', validTokenId).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 400 if the file is not a valid csv', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 1).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/notValidCsv.csv").set('Authorization', validTokenId).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });


});