const timeOut = 60 * 1000;
const delayTime = timeOut/2;
const db = require(__base + "db/index");
const usersDelegate = require(__base + 'delegates/users.delegate');


/* *
* users
* range of usable data n° 76 ~ 90
* 81~85 for delegate layer
* */

const index = 81;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 =  index + 4;
const validTokenId = "test"+index;
const validTokenId2 = "test"+index2;
const validTokenId3 = "test"+index3;
const validTokenId4 = "test"+index4;
const validTokenId5 = "test"+index5;
const validUserEmail = "test"+index+"@gmail.com";
const validUserEmail2 = "test"+index2+"@gmail.com";
const validUserEmail3 = "test"+index3+"@gmail.com";
const validUserEmail4 = "test"+index4+"@gmail.com";
const validUserEmail5 = "test"+index5+"@gmail.com";

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound",
    badImplementation: "badImplementation",
    unauthorized: "unauthorized",
    //to add the other error names

};

//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});


beforeEach(() => {
    jest.setTimeout(timeOut);
});

/* good cases==============================================================================================================*/

describe('good cases on users.delegate', () => {

    test('verifyToken() it should return user email if token is valid', async () => {
        

        let user = await usersDelegate.verifyToken(validTokenId);
        expect(user).toBe(validUserEmail);

    });

    test('getCollaboratorByProjectId()', async () => {
        

        let project_id = index;

        let res = await usersDelegate.getCollaboratorByProjectId(validUserEmail, project_id);
        expect(res.length).toBe(1);
        expect(parseInt(res[0].id)).toBe(index);
        expect(res[0].data.email).toBeDefined();
    });

    test('getScreenersByProjectId()', async () => {
        

        let project_id = index;

        let res = await usersDelegate.getScreenersByProjectId(validUserEmail, project_id);
        expect(res.length).toBe(1);
        expect(parseInt(res[0].id)).toBe(index);
        expect(res[0].data.email).toBeDefined();
    });


});

/* bad cases==============================================================================================================*/




describe('bad cases on users.delegate', () => {

    test('verifyToken() it should return error \'badRequest\' if there\'s no token', async () => {
        

        let user = undefined;

        try{
            user = await usersDelegate.verifyToken("");
        }catch(e){
            user = e;
        }
        expect(user.name).toBe(errorNames.badRequest);

    });

    test('verifyToken() it should return error \'unauthorized\' if token is not valid', async () => {
        

        let user = undefined;

        let notValidTokenId = "654321";

        try{
            user = await usersDelegate.verifyToken(notValidTokenId);
        }catch(e){
            user = e;
        }
        expect(user.name).toBe(errorNames.unauthorized);

    });

});