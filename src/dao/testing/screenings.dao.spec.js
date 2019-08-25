
const timeOut = 30 * 1000;

const screeningsDao = require(__base + 'dao/screenings.dao');
//the config file
const config = require(__base + 'config');
const db = require(__base + "db/index");


/* *
* screenings
* range of usable data n° 106~ 120
* 116~120 for dao layer
* */


const index = 116;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;


// valid examples
const newScreeningData = {
    "manual_screening_type": config.manual_screening_type.single_predicate
};

beforeEach(async () => {
    jest.setTimeout(timeOut)
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

describe('test cases on screenings.dao ', () => {

    test('insert()', async () => {


        let user_id = index;
        let project_id = index2;
        let res = await screeningsDao.insert(newScreeningData, user_id, project_id);

        expect(res.data).toMatchObject(newScreeningData);

    });

    test('update()', async () => {


        let screening_id = index;

        let res = await screeningsDao.update(screening_id, newScreeningData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {


        let screening_id = index5;

        let res = await screeningsDao.deletes(screening_id);

        expect(parseInt(res)).toBe(1);

    });

    test('deleteByUserIdAndProjectId()', async () => {



        let user_id = index;
        let project_id = index2;

        let res = await screeningsDao.deleteByUserIdAndProjectId(user_id, project_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {



        let screening_id = index;

        let res = await screeningsDao.selectById(screening_id);

        expect(parseInt(res.id)).toBe(screening_id);
        expect(res.data).toMatchObject(newScreeningData);

    });

    test('selectByUserId()', async () => {


        let user_id = index;

        let res = await screeningsDao.selectByUserId(user_id);

        expect(parseInt(res.length)).toBe(1);


    });

    test('selectByProjectId()', async () => {


        let project_id = index;

        let res = await screeningsDao.selectByProjectId(project_id);

        expect(parseInt(res.length)).toBe(1);


    });

    test('selectByUserIdAndProjectId()', async () => {



        let user_id = index;
        let project_id = index;

        let res = await screeningsDao.selectByUserIdAndProjectId(user_id, project_id);

        expect(res.data).toMatchObject(newScreeningData);

    });


    test('countByProject()', async () => {


        let project_id = index;

        let res = await screeningsDao.countByProject(project_id);

        expect(parseInt(res)).toBe(1);


    });

});