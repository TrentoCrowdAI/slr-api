const timeOut = 20 * 1000;

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

/* good cases==============================================================================================================*/

describe('good cases on users.delegate', () => {

    test('it should return user email if token is valid', async () => {
        jest.setTimeout(timeOut);

        let user = await usersDelegate.verifyToken(validTokenId);
        expect(user).toBe(validUserEmail);

    });

});

/* bad cases==============================================================================================================*/




describe('bad cases on users.delegate', () => {

    test('it should return error \'badRequest\' if there\'s no token', async () => {
        jest.setTimeout(timeOut);

        let user = undefined;

        try{
            user = await usersDelegate.verifyToken("");
        }catch(e){
            user = e;
        }
        expect(user.name).toBe(errorNames.badRequest);

    });

    test('it should return error \'unauthorized\' if token is not valid', async () => {
        jest.setTimeout(timeOut);

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