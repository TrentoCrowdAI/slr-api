const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

const projectPapersDao = require(__base + 'dao/projectPapers.dao');

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

describe('test cases on projectPapers.dao ', () => {

    test('insert()', async () => {
        jest.setTimeout(timeOut);



        let project_id = index;

        let res = await projectPapersDao.insert(newProjectPaperData, project_id);

        expect(parseInt(res.project_id)).toBe(project_id);
        expect(res.data).toMatchObject(newProjectPaperData);

    });

    test('insertByList()', async () => {
        jest.setTimeout(timeOut);


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
        jest.setTimeout(timeOut);

        let arrayEid = ["e001", "e002"];
        let project_id = index;

        let res = await projectPapersDao.insertFromPaper(arrayEid, project_id);

        expect(parseInt(res.length)).toBe(2);

    });



    test('update()', async () => {
        jest.setTimeout(timeOut);


        let projectPaper_id = index;

        let res = await projectPapersDao.update(projectPaper_id, newProjectPaperData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {
        jest.setTimeout(timeOut);


        let projectPaper_id = index5;

        let res = await projectPapersDao.deletes(projectPaper_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {
        jest.setTimeout(timeOut);


        let projectPaper_id = index;


        let res = await projectPapersDao.selectById(projectPaper_id);

        expect(parseInt(res.id)).toBe(projectPaper_id);
        expect(res.data).toMatchObject(newProjectPaperData);

    });


    test('selectByProject()', async () => {
        jest.setTimeout(timeOut);


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
        jest.setTimeout(timeOut);


        let project_id=index2;

        let res = await projectPapersDao.selectAllNotEvaluatedAndScreened(project_id);

        expect(parseInt(res.length)).toBe(1);

    });



    test('selectNotScreenedByProject()', async () => {
        jest.setTimeout(timeOut);


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
        jest.setTimeout(timeOut);


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
        jest.setTimeout(timeOut);


        let project_id=index2;

        let res = await projectPapersDao.countAutoScreenedOutOfTotalPapers(project_id);

        expect(parseInt(res.totalAutoScreened)).toBe(0);
        expect(parseInt(res.totalResults)).toBe(1);

    });



    test('selectScreenedByProject()', async () => {
        jest.setTimeout(timeOut);


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
        jest.setTimeout(timeOut);

        let user_id = index;
        let project_id=index;



        let res = await projectPapersDao.selectOneNotVotedByUserIdAndProjectId(user_id, project_id);

        expect(res.data).toMatchObject(newProjectPaperData);

    });


    test('manualScreeningProgress()', async () => {
        jest.setTimeout(timeOut);

        let user_id = index2
        let project_id=index2;

        let res = await projectPapersDao.manualScreeningProgress(user_id, project_id);

        expect(parseInt(res.totalPapers)).toBe(1);
        expect(parseInt(res.screenedPapers)).toBe(1);

    });

    test('selectAllByProject()', async () => {
        jest.setTimeout(timeOut);


        let project_id=index2;

        let res = await projectPapersDao.selectAllByProjectId(project_id);

        expect(parseInt(res.length)).toBe(1);

    });

    test('checkExistenceByEids()', async () => {
        jest.setTimeout(timeOut);

        let arrayEid = ["1", "2"];
        let project_id=index2;

        let res = await projectPapersDao.checkExistenceByEids(arrayEid, project_id);

        expect(parseInt(res.length)).toBe(0);

    });

});