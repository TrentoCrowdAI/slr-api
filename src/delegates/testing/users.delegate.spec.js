const timeOut = 20 * 1000;

const usersDelegate = require(__base + 'delegates/users.delegate');

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound",
    badImplementation: "badImplementation",
    unauthorized: "unauthorized",
     //to add the other error names
    
};

/* *
* range of usable data n° 76 ~ 90
* 81~85 for delegate layer
* */

const index = 81;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId3 = "test" + index3;

/* good cases==============================================================================================================*/

describe('good cases on users.delegate', () => {

    test('it should return user email if token is valid', async () => {
        jest.setTimeout(timeOut);

        let user = await usersDelegate.verifyToken(validTokenId);
        expect(user).toBe(validTokenId+"@gmail.com");

    });

});

/* bad cases==============================================================================================================*/

const notValidTokenId = "654321";


describe('bad cases on users.delegate', () => {

    test('it should return error \'badRequest\' if there\'s no token', async () => {
        jest.setTimeout(timeOut);

        let user = undefined;

        try{
            user = await usersDelegate.verifyToken();
        }catch(e){
            user = e;
        }
        expect(user.name).toBe(errorNames.badRequest);

    });

    test('it should return error \'unauthorized\' if token is not valid', async () => {
        jest.setTimeout(timeOut);

        let user = undefined;

        try{
            user = await usersDelegate.verifyToken(notValidTokenId);
        }catch(e){
            user = e;
        }
        expect(user.name).toBe(errorNames.unauthorized);

    });

});