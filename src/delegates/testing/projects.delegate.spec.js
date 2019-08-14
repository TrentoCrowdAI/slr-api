const timeOut = 20 * 1000;

const projectsDelegate = require(__base + 'delegates/projects.delegate');

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound",
    badImplementation: "badImplementation",
    unauthorized: "unauthorized",
     //to add the other error names
    
};

/* range of usable data n° 7 ~ 9 */
const index = 7;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId3 = "test" + index3;


/* good cases=====================================================================================================*/

//valid user_email
const valid_user_email = "test@gmail.com";

// valid examples
const validExample = {
    "name": "aa",
    "description": "aaa"
};


const validEmail = {"email": "123@gmail.com"};
const validEmail2 = {"email": "test@gmail.com"};


describe('good cases on projects.delegate', () => {

    test('projects.delegate.insert() adds a new project to the db', async () => {
        jest.setTimeout(timeOut);

        let project = await projectsDelegate.insert(valid_user_email, validExample);
        expect(project.data).toMatchObject(validExample);
    });


});


/* bad cases==============================================================================================================*/


//not valid examples
const notValidExampleForDescriptionMissing = {
    "name": "aa"
};
const notValidExampleForNameMissing = {
    "description": "aaa"
};
const notValidExampleForNameEmpty = {
    "name": "",
    "description": "aaa"
};

const notValidExampleForDescriptionEmpty = {
    "name": "bb",
    "description": ""
};


describe('bad cases on projects.delegate', () => {

    describe('bad cases on projects.delegate.insert()', () => {

        test('it should return error \'badRequest\' if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            let project = undefined;

            //the name is missing
            try{
                project = await projectsDelegate.insert(valid_user_email, notValidExampleForNameMissing);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the description is missing
            try{
                project = await projectsDelegate.insert(valid_user_email, notValidExampleForDescriptionMissing);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the name is empty
            try{
                project = await projectsDelegate.insert(valid_user_email, notValidExampleForNameEmpty);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the description is empty
            try{
                project = await projectsDelegate.insert(valid_user_email, notValidExampleForDescriptionEmpty);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

        });

    });

});