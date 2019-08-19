const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

const searchesDao = require(__base + 'dao/searches.dao');
//the config file
const config = require(__base + 'config');


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


describe('test cases on searches.dao ', () => {

    test('insert()', async () => {
        jest.setTimeout(timeOut);

        let res = await searchesDao.insert(newPaperData);

        expect(res.data).toMatchObject(newPaperData);

    });

    test('insertByList()', async () => {
        jest.setTimeout(timeOut);

        let arrayPaperData = [newPaperData,newPaperData];

        let res = await searchesDao.insertByList(arrayPaperData);

        expect(res.length).toBe(2);

    });

    test('update()', async () => {
        jest.setTimeout(timeOut);

        let paper_id = index;

        let res = await searchesDao.update(paper_id, newPaperData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {
        jest.setTimeout(timeOut);

        let paper_id = index5;

        let res = await searchesDao.deletes(paper_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {
        jest.setTimeout(timeOut);


        let paper_id = index;

        let res = await searchesDao.selectById(paper_id);

        expect(parseInt(res.id)).toBe(paper_id);
        expect(res.data).toMatchObject(newPaperData);

    });

    test('checkExistenceByEids()', async () => {
        jest.setTimeout(timeOut);

        let arrayEid = ["gfa","ggg"];

        let res = await searchesDao.checkExistenceByEids(arrayEid);

        expect(parseInt(res.length)).toBe(0);


    });


});