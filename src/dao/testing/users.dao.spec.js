const timeOut = 30 * 1000;
const usersDao = require(__base + 'dao/users.dao');
const db = require(__base + "db/index");


/* *
 * users
 * range of usable data n° 76~ 90
 * 86~90 for dao layer
 * */


const index = 86;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;


// data
let newUserData = {
    email: "abc@gmail.com",
    name: "name",
    picture: "picture.jpg",
};

beforeEach(async () => {
    jest.setTimeout(timeOut)
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

describe('test cases on users.dao ', () => {

    test('insert()', async () => {


        let res = await usersDao.insert(newUserData);

        expect(res.data).toMatchObject(newUserData);

    });


    test('update()', async () => {


        let putUserData = {
            email: "test" + index + "@gmail.com",
            name: "name",
            picture: "picture.jpg",
        };

        let res = await usersDao.update(putUserData);

        expect(parseInt(res)).toBe(1);

    });


    test('getUserByEmail()', async () => {


        let email = "test" + index + "@gmail.com";

        let res = await usersDao.getUserByEmail(email);

        expect(res.data.email).toBe(email);
        //expect(res.data).toMatchObject(newUserData);

    });

    test('getUserByArrayIds()', async () => {


        let arrayIds = [index, index2, index3];

        let res = await usersDao.getUserByArrayIds(arrayIds);

        expect(parseInt(res.length)).toBe(3);

    });

    test('getUserById()', async () => {


        let id = index;

        let res = await usersDao.getUserById(id);

        expect(parseInt(res.id)).toBe(id);
        //expect(res.data).toMatchObject(newUserData);

    });

});