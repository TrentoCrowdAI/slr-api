const timeOut = 20 * 1000;

const filtersDelegate = require(__base + 'delegates/filters.delegate');



/* *
* filters
* range of usable data n° 1 ~ 15
* 6~10 for delegate layer
* */

const index = 6;
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






describe('good cases on filters.delegate ', () => {

    test('filters.delegate.insert() adds a new filter to the db', async () => {
        jest.setTimeout(timeOut);

        // valid examples
        let validExample = {
            "project_id": index,
            "filter": {
                "predicate": "aaa",
                "inclusion_description": "bbb",
                "exclusion_description": "ccc",
            }
        };
        let filter = await filtersDelegate.insert(validUserEmail, validExample.filter, validExample.project_id);
        expect(parseInt(filter.project_id)).toBe(validExample.project_id);
        expect(filter.data).toMatchObject(validExample.filter)
    });

});

/* bad cases==============================================================================================================*/












/*bad cases*/
describe('bad cases on filters.delegate ', () => {

    describe('bad cases filters.delegate.insert()', () => {

        test('it should return error \'badRequest\' if parameters are not valid', async () => {
            jest.setTimeout(timeOut);
            let filter = undefined;

            //project Id is not defined
            //not valid examples
            let notValidExampleForProjectId = {
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForProjectId.filter, notValidExampleForProjectId.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //project Id is not a number
            let notValidExampleForProjectIdNotNumber = {
                "project_id": "abc",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForProjectIdNotNumber.filter, notValidExampleForProjectIdNotNumber.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //project Id is not an integer
            let notValidExampleForProjectIdNotInteger = {
                "project_id": index+".5",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForProjectIdNotInteger.filter, notValidExampleForProjectIdNotInteger.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //a mandatory field is missing
            let notValidExampleForExclusionDescription = {
                "project_id": index + "",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForExclusionDescription.filter, notValidExampleForExclusionDescription.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

        });

        test('it should return \'unauthorized\' if the project doesn\'t exist', async () => {
            jest.setTimeout(timeOut);

            let notValidExampleForProjectIdNotExist = {
                "project_id": "9999",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForProjectIdNotExist.filter, notValidExampleForProjectIdNotExist.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.unauthorized);

        });

        test('it should return \'unauthorized\' if the user does not have access', async () => {
            jest.setTimeout(timeOut);

            let notValidExampleForProjectIdNotPermission = {
                "project_id": index2 + "",
                "filter": {
                    "predicate": "aaa",
                    "inclusion_description": "bbb",
                    "exclusion_description": "ccc",
                }
            };
            try{
                filter = await filtersDelegate.insert(validUserEmail, notValidExampleForProjectIdNotPermission.filter, notValidExampleForProjectIdNotPermission.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.unauthorized);

        });

    });


});