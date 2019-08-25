
const timeOut = 30 * 1000;

const projectsDao = require(__base + 'dao/projects.dao');

const db = require(__base + "db/index");

/* *
* projects
* range of usable data n° 31~ 45
* 41~45 for dao layer
* */


const index = 41;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;


// valid examples
const newProjectData = {
    "name": "aa",
    "description": "aaa"
};

beforeEach(async () => {
    jest.setTimeout(timeOut)
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

describe('test cases on projects.dao ', () => {

    test('insert()', async () => {


        let res = await projectsDao.insert(newProjectData);

        expect(res.data).toMatchObject(newProjectData);

    });

    test('update()', async () => {


        let project_id = index;

        let res = await projectsDao.update(project_id, newProjectData);

        expect(parseInt(res)).toBe(1);

    });

    test('updateLastModifiedDate()', async () => {


        let project_id = index;

        let res = await projectsDao.updateLastModifiedDate(project_id);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {



        let project_id = index5;

        let res = await projectsDao.deletes(project_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {



        let project_id = index;

        let res = await projectsDao.selectById(project_id);

        expect(parseInt(res.id)).toBe(project_id);
        expect(res.data).toMatchObject(newProjectData);

    });

    test('selectByIdAndUserId()', async () => {



        let project_id = index3;
        let user_id = index3;

        let res = await projectsDao.selectByIdAndUserId(project_id, user_id);

        expect(parseInt(res.id)).toBe(project_id);
        //expect(res.data).toMatchObject(newProjectData);

    });


    test('selectByUserId()', async () => {



        let user_id = index2;
        let orderBy = "id";
        let sort = "ASC";
        let start = 0;
        let count = 10;


        let res = await projectsDao.selectByUserId(user_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });


    test('selectByScreeningUser()', async () => {



        let user_id = index2;
        let orderBy = "id";
        let sort = "ASC";
        let start = 0;
        let count = 10;


        let res = await projectsDao.selectByScreeningUser(user_id, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });


});