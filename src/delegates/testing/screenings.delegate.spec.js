
const timeOut = 60 * 1000;
const delayTime = timeOut/2;
const db = require(__base + "db/index");
const screeningsDelegate = require(__base + 'delegates/screenings.delegate');
//the config file
const config = require(__base + 'config');



/* *
* screenings
* range of usable data n° 106~ 120
* 111~115 for delegate layer
* */


const index = 111;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validUserEmail = "test" + index + "@gmail.com";
const validUserEmail2 = "test" + index2 + "@gmail.com";
const validUserEmail3 = "test" + index3 + "@gmail.com";
const validUserEmail4 = "test" + index4 + "@gmail.com";
const validUserEmail5 = "test" + index5 + "@gmail.com";

//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

beforeEach(() => {
    jest.setTimeout(timeOut);
});

describe('test cases on screenings.delegate ', () => {

    test('insertByArray()', async () => {


        let array_screener_id = [index2, index3, index4];
        let manual_screening_type = config.manual_screening_type.single_predicate;
        let project_id = index;
        let res = await screeningsDelegate.insertByArray(validUserEmail, array_screener_id, manual_screening_type, project_id);

        expect(res.length).toBe(array_screener_id.length);

        expect(parseInt(res[0].user_id)).toBe(array_screener_id[0]);

    });

    test('insertByArrayAfterStarting()', async () => {


        let array_screener_id = [index5];
        let project_id = index;

        let res = await screeningsDelegate.insertByArrayAfterStarting(validUserEmail, array_screener_id, project_id);

        expect(res.length).toBe(array_screener_id.length);
        expect(parseInt(res[0].user_id)).toBe(array_screener_id[0]);

    });


    test('deletes()', async () => {



        let screeners_id = index5;
        let project_id = index5

        let res = await screeningsDelegate.deletes(validUserEmail5, screeners_id, project_id);



    });


    test('selectAllByProjectId()', async () => {


        let project_id = index2;

        let res = await screeningsDelegate.selectAllByProjectId(validUserEmail2, project_id);

        expect(parseInt(res.length)).toBe(1);


    });


    test('selectByScreeningUser()', async () => {


        let orderBy="id";
        let sort="ASC";
        let start=0;
        let count=10;

        let res = await screeningsDelegate.selectByScreeningUser(validUserEmail2, orderBy, sort, start, count);

        expect(parseInt(res.totalResults)).toBe(2);


    });

    test('selectById()', async () => {



        let screening_id = index2;

        let res = await screeningsDelegate.selectById(validUserEmail2, screening_id);

        expect(parseInt(res.id)).toBe(screening_id);
        expect(res.data).toBeDefined();

    });

    test('selectOneNotVotedByUserIdAndProjectId()', async () => {



        let screening_id = index4;

        let res = await screeningsDelegate.selectOneNotVotedByUserIdAndProjectId(validUserEmail4, screening_id);

        expect(res.data).toBeDefined();

    });


});