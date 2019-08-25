
const timeOut = 30 * 1000;

const searchesDao = require(__base + 'dao/searches.dao');
//the config file
const config = require(__base + 'config');
const db = require(__base + "db/index");


/* *
* search papers
* range of usable data n° 16~ 30
* 26~30 for dao layer
* */



const index = 26;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;


// valid examples
let newPaperData = {
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

describe('test cases on searches.dao ', () => {

    test('insert()', async () => {


        let res = await searchesDao.insert(newPaperData);

        expect(res.data).toMatchObject(newPaperData);

    });

    test('insertByList()', async () => {


        let arrayPaperData = [newPaperData,newPaperData];

        let res = await searchesDao.insertByList(arrayPaperData);

        expect(res.length).toBe(2);

    });

    test('update()', async () => {


        let paper_id = index;

        let res = await searchesDao.update(paper_id, newPaperData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {


        let paper_id = index5;

        let res = await searchesDao.deletes(paper_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {



        let paper_id = index;

        let res = await searchesDao.selectById(paper_id);

        expect(parseInt(res.id)).toBe(paper_id);
        expect(res.data).toMatchObject(newPaperData);

    });

    test('checkExistenceByEids()', async () => {


        let arrayEid = ["gfa","ggg"];

        let res = await searchesDao.checkExistenceByEids(arrayEid);

        expect(parseInt(res.length)).toBe(0);


    });


});