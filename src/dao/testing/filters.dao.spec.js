const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

const filtersDao = require(__base + 'dao/filters.dao');

/* *
* filters
* range of usable data n° 1 ~ 15
* 10~15 for dao layer
* */


const index = 10;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 =  index + 4;




describe('test cases on filters.dao ', () => {

    test('insert()', async () => {
        jest.setTimeout(timeOut);


        let newFilterData = {
            "name": "abc",
            "predicate": "abc",
            "inclusion_description": "abc",
            "exclusion_description": "abc",
        };
        let project_id = index;

        let res = await filtersDao.insert(newFilterData, project_id);

        expect(parseInt(res.project_id)).toBe(project_id);
        expect(res.data).toMatchObject(newFilterData);

    });

    test('update()', async () => {
        jest.setTimeout(timeOut);


        let newFilterData = {
            "name": "abc",
            "predicate": "abc",
            "inclusion_description": "abc",
            "exclusion_description": "abc",
        };
        let filter_id = index;

        let res = await filtersDao.update(filter_id, newFilterData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {
        jest.setTimeout(timeOut);


        let filter_id = index5;

        let res = await filtersDao.deletes(filter_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {
        jest.setTimeout(timeOut);


        let filter_id = index;
        let newFilterData = {
            "name": "abc",
            "predicate": "abc",
            "inclusion_description": "abc",
            "exclusion_description": "abc",
        };

        let res = await filtersDao.selectById(filter_id);

        expect(parseInt(res.id)).toBe(filter_id);
        expect(res.data).toMatchObject(newFilterData);

    });

    test('selectByArrayId()', async () => {
        jest.setTimeout(timeOut);


        let arrayFilterId = [index,index2];

        let res = await filtersDao.selectByArrayId(arrayFilterId);

        expect(parseInt(res.length)).toBe(2);

    });

    test('selectByProject()', async () => {
        jest.setTimeout(timeOut);


        let project_id=index2;
        let orderBy="id";
        let sort="ASC";
        let start=0;
        let count=10;


        let res = await filtersDao.selectByProject(project_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });

    test('selectAllByProject()', async () => {
        jest.setTimeout(timeOut);

        let project_id=index2;

        let res = await filtersDao.selectAllByProject(project_id);

        expect(parseInt(res.length)).toBe(1);

    });

    test('countByProject()', async () => {
        jest.setTimeout(timeOut);


        let project_id=index2;

        let res = await filtersDao.countByProject(project_id);

        expect(parseInt(res)).toBe(1);

    });

});