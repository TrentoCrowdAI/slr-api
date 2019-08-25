const timeOut = 60 * 1000;
const delayTime = timeOut/2;

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
const index5 = index + 4;
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


beforeAll(async () => {

    //waiting to avoid exceeding the limit of 20 connections on heroku postgres
    jest.setTimeout(timeOut);
    await new Promise(res => setTimeout(() => {
        res();
    }, delayTime));
});

beforeEach(() => {
    jest.setTimeout(timeOut);
});



/* good cases=====================================================================================================*/
let newProjectData ={
    "name": "aa",
    "description": "aaa"
};

describe('good cases on projects.delegate', () => {

    test('insert() adds a new project to the db', async () => {
        


        let project = await projectsDelegate.insert(validUserEmail, newProjectData);
        expect(project.data).toMatchObject(newProjectData);
    });

    test('updateNameAndDescription()', async () => {
        

        let project_id = index;

        let res = await projectsDelegate.updateNameAndDescription(validUserEmail, project_id, newProjectData);


    });


    test('deletes()', async () => {
        

        let project_id = index5;

        let res = await projectsDelegate.deletes(validUserEmail5, project_id);


    });


    test('selectById()', async () => {
        


        let project_id = index;

        let res = await projectsDelegate.selectById(validUserEmail, project_id);

        expect(parseInt(res.id)).toBe(project_id);
        expect(res.data).toMatchObject(newProjectData);

    });



    test('selectByUserId()', async () => {
        


        let orderBy = "id";
        let sort = "ASC";
        let start = 0;
        let count = 10;


        let res = await projectsDelegate.selectByUserId(validUserEmail2, orderBy, sort, start, count);

        expect(parseInt(res.results.length)).toBe(1);
        expect(parseInt(res.totalResults)).toBe(1);

    });


    test('shareProject()', async () => {
        


        let project_id = index;
        let collaborator_email = validUserEmail2;


        let res = await projectsDelegate.shareProject(validUserEmail, project_id, collaborator_email);

        expect(res.data.email).toBe(collaborator_email);

    });

    test('deleteShareProject()', async () => {
        


        let project_id = index4;
        let collaborator_id = index4;


        let res = await projectsDelegate.deleteShareProject(validUserEmail4, project_id, collaborator_id);


    });


});


/* bad cases==============================================================================================================*/


describe('bad cases on projects.delegate', () => {

    describe('bad cases on projects.delegate.insert()', () => {

        test('insert() it should return error \'badRequest\' if parameters are not valid', async () => {
            

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