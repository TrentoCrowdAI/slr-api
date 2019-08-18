const timeOut = 20 * 1000;

const projectsDelegate = require(__base + 'delegates/projects.delegate');



/* *
* project
* range of usable data n° 31 ~ 45
* 36~40 for delegate layer
* */
const index = 36;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 =  index + 4;
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


/* good cases=====================================================================================================*/


describe('good cases on projects.delegate', () => {

    test('projects.delegate.insert() adds a new project to the db', async () => {
        jest.setTimeout(timeOut);

        // valid examples
        const validExample = {
            "name": "aa",
            "description": "aaa"
        };

        let project = await projectsDelegate.insert(validUserEmail, validExample);
        expect(project.data).toMatchObject(validExample);
    });


});


/* bad cases==============================================================================================================*/


describe('bad cases on projects.delegate', () => {

    describe('bad cases on projects.delegate.insert()', () => {

        test('it should return error \'badRequest\' if parameters are not valid', async () => {
            jest.setTimeout(timeOut);

            let project = undefined;

            //the name is missing
            const notValidExampleForNameMissing = {
                "description": "aaa"
            };
            try{
                project = await projectsDelegate.insert(validUserEmail, notValidExampleForNameMissing);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the description is missing
            const notValidExampleForDescriptionMissing = {
                "name": "aa"
            };
            try{
                project = await projectsDelegate.insert(validUserEmail, notValidExampleForDescriptionMissing);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the name is empty
            const notValidExampleForNameEmpty = {
                "name": "",
                "description": "aaa"
            };
            try{
                project = await projectsDelegate.insert(validUserEmail, notValidExampleForNameEmpty);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

            //the description is empty
            const notValidExampleForDescriptionEmpty = {
                "name": "bb",
                "description": ""
            };
            try{
                project = await projectsDelegate.insert(validUserEmail, notValidExampleForDescriptionEmpty);
            }catch(e){
                project = e;
            }
            expect(project.name).toBe(errorNames.badRequest);

        });

    });

});