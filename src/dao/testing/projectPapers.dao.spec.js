
const timeOut = 30 * 1000;

const projectPapersDao = require(__base + 'dao/projectPapers.dao');

const db = require(__base + "db/index");

/* *
* projectPapers
* range of usable data n° 46~ 60
* 56~60 for dao layer
* */


const index = 56;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 =  index + 4;



let newProjectPaperData = {
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

beforeEach(async () => {
    jest.setTimeout(timeOut)
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

describe('test cases on projectPapers.dao ', () => {

    test('insert()', async () => {




        let project_id = index;

        let res = await projectPapersDao.insert(newProjectPaperData, project_id);

        expect(parseInt(res.project_id)).toBe(project_id);
        expect(res.data).toMatchObject(newProjectPaperData);

    });

    test('insertByList()', async () => {



        let arrayProjectPaperData = [
            {
            "authors": "aa",
            "title": "aaa",
            "year": "2099",
            "date": "2099-12-12",
            "source_title": "aaa",
            "link": "https://www.scopus.com/",
            "abstract": "abc",
            "document_type": "Article",
            "source": "Scopus",
            "eid": "123456",
            "abstract_structured": "1",
            "filter_oa_include": "1",
            "filter_study_include": "0",
            "notes": "",
            "manual": "0",
            "doi": "abcdefg"
            },
            {
                "authors": "aa",
                "title": "aaa",
                "year": "2099",
                "date": "2099-12-12",
                "source_title": "aaa",
                "link": "https://www.scopus.com/",
                "abstract": "abc",
                "document_type": "Article",
                "source": "Scopus",
                "eid": "1234567",
                "abstract_structured": "1",
                "filter_oa_include": "1",
                "filter_study_include": "0",
                "notes": "",
                "manual": "0",
                "doi": "abcdefg"
            },
        ];
        let project_id = index;

        let res = await projectPapersDao.insertByList(arrayProjectPaperData, project_id);

        expect(parseInt(res.length)).toBe(2);

    });


    test('insertFromPaper()', async () => {


        let arrayEid = ["e001", "e002"];
        let project_id = index;

        let res = await projectPapersDao.insertFromPaper(arrayEid, project_id);

        expect(parseInt(res.length)).toBe(2);

    });



    test('update()', async () => {



        let projectPaper_id = index;

        let res = await projectPapersDao.update(projectPaper_id, newProjectPaperData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {



        let projectPaper_id = index5;

        let res = await projectPapersDao.deletes(projectPaper_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {



        let projectPaper_id = index;


        let res = await projectPapersDao.selectById(projectPaper_id);

        expect(parseInt(res.id)).toBe(projectPaper_id);
        expect(res.data).toMatchObject(newProjectPaperData);

    });


    test('selectByProject()', async () => {



        let project_id=index2;
        let orderBy="date_created";
        let sort="ASC";
        let start=0;
        let count=10;


        let res = await projectPapersDao.selectByProject(project_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });

    test('selectAllNotEvaluatedAndScreened()', async () => {



        let project_id=index2;

        let res = await projectPapersDao.selectAllNotEvaluatedAndScreened(project_id);

        expect(parseInt(res.length)).toBe(1);

    });



    test('selectNotScreenedByProject()', async () => {



        let project_id=index2;
        let orderBy="date_created";
        let sort="ASC";
        let start=0;
        let count=10;
        let min_confidence=0.0;
        let max_confidence = 1.0;

        let res = await projectPapersDao.selectNotScreenedByProject(project_id, orderBy, sort, start, count, min_confidence, max_confidence);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });

    test('selectManualByProject()', async () => {



        let project_id=index3;
        let orderBy="date_created";
        let sort="ASC";
        let start=0;
        let count=10;


        let res = await projectPapersDao.selectManualByProject(project_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });


    test('countAutoScreenedOutOfTotalPapers()', async () => {



        let project_id=index2;

        let res = await projectPapersDao.countAutoScreenedOutOfTotalPapers(project_id);

        expect(parseInt(res.totalAutoScreened)).toBe(0);
        expect(parseInt(res.totalResults)).toBe(1);

    });



    test('selectScreenedByProject()', async () => {



        let project_id=index4;
        let orderBy="date_created";
        let sort="ASC";
        let start=0;
        let count=10;


        let res = await projectPapersDao.selectScreenedByProject(project_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });

    test('selectOneNotVotedByUserIdAndProjectId()', async () => {


        let user_id = index;
        let project_id=index;



        let res = await projectPapersDao.selectOneNotVotedByUserIdAndProjectId(user_id, project_id);

        expect(res.data).toMatchObject(newProjectPaperData);

    });


    test('manualScreeningProgress()', async () => {


        let user_id = index2
        let project_id=index2;

        let res = await projectPapersDao.manualScreeningProgress(user_id, project_id);

        expect(parseInt(res.totalPapers)).toBe(1);
        expect(parseInt(res.screenedPapers)).toBe(1);

    });

    test('selectAllByProject()', async () => {



        let project_id=index2;

        let res = await projectPapersDao.selectAllByProjectId(project_id);

        expect(parseInt(res.length)).toBe(1);

    });

    test('checkExistenceByEids()', async () => {


        let arrayEid = ["1", "2"];
        let project_id=index2;

        let res = await projectPapersDao.checkExistenceByEids(arrayEid, project_id);

        expect(parseInt(res.length)).toBe(0);

    });

});