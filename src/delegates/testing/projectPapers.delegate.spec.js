const timeOut = 60 * 1000;
const db = require(__base + "db/index");

const projectPapersDelegate = require(__base + 'delegates/projectPapers.delegate');
//the config file
const config = require(__base + 'config');

/* *
 * projectPapers
 * range of usable data n° 46~ 60
 * 51~55 for delegate layer
 * */


const index = 51;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validUserEmail = "test" + index + "@gmail.com";
const validUserEmail2 = "test" + index2 + "@gmail.com";
const validUserEmail3 = "test" + index3 + "@gmail.com";
const validUserEmail4 = "test" + index4 + "@gmail.com";
const validUserEmail5 = "test" + index5 + "@gmail.com";

let newPaper = {
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

//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

beforeEach(() => {
    jest.setTimeout(timeOut);
});

describe('test cases on projectPapers.delegate ', () => {

    test('insertFromPaper()', async () => {

        let project_id = index;
        let arrayEid = ["paper001", "paper002"];

        let res = await projectPapersDelegate.insertFromPaper(validUserEmail, arrayEid, project_id);

        expect(parseInt(res.length)).toBe(arrayEid.length);
        expect(parseInt(res[0].project_id)).toBe(project_id);
        //expect(res[0].data).toMatchObject(newPaper)
    });


    test('insertCustomPaper()', async () => {


        let project_id = index;

        let res = await projectPapersDelegate.insertCustomPaper(validUserEmail, project_id, newPaper);
        expect(parseInt(res.project_id)).toBe(project_id);
        expect(res.data).toMatchObject(newPaper)
    });

    test('update()', async () => {


        let projectPaper_id = index;
        let res = await projectPapersDelegate.update(validUserEmail, projectPaper_id, newPaper);
        //expect(parseInt(res)).toBeDefined();

    });


    test('deletes()', async () => {


        let projectPaper_id = index5;
        let res = await projectPapersDelegate.deletes(validUserEmail5, projectPaper_id);


    });


    test('selectByProject()', async () => {


        let project_id = index2;
        let type = config.screening_status.all;
        let orderBy = "date_created";
        let sort = "ASC";
        let start = 0;
        let count = 10;
        let min_confidence = 0.0;
        let max_confidence = 1.0;

        let res = await projectPapersDelegate.selectByProject(validUserEmail2, project_id, type, orderBy, sort, start, count, min_confidence, max_confidence);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });


});
