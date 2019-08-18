const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;


/* *
* upload file
* range of usable data n° 61~ 75
* 61~65 for controller layer
* */

const index = 61;
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
        let response = await request(app).post('/upload/csv').field("project_id", index).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(201);

    });

});


/* bad cases==============================================================================================================*/

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

        //the project_id is missing
        let response = await request(app).post('/upload/csv').field("paper_id", index).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        //the project id is not a number
        response = await request(app).post('/upload/csv').field("project_id", "abc").field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        //the project id is not integer
        response = await request(app).post('/upload/csv').field("project_id", index + ".6").field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        //the parameter fileds is missing
        response = await request(app).post('/upload/csv').field("project_id", index).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

        //the parameter fileds is not valid
        response = await request(app).post('/upload/csv').field("project_id", index).field("fields", JSON.stringify({"a": "b"})).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 401 if projects is not present', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", 9999).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });


    test('POST /upload/csv should return 401 if user hasn\'t permission', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", index2).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validCsv.csv").set('Authorization', validTokenId);
        expect(response.status).toBe(401);
    });

    test('POST /upload/csv should return 400 if the file does not exist', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", index).field("fields", JSON.stringify(validExampleForCsv)).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 400 if the file is not a csv', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", index).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/validPdf.pdf").set('Authorization', validTokenId).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });

    test('POST /upload/csv should return 400 if the file is not a valid csv', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).post('/upload/csv').field("project_id", index).field("fields", JSON.stringify(validExampleForCsv)).attach("file", __base + "db/notValidCsv.csv").set('Authorization', validTokenId).set('Authorization', validTokenId);
        expect(response.status).toBe(400);

    });


});