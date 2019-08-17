const timeOut = 20 * 1000;

const filtersDelegate = require(__base + 'delegates/filters.delegate');

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound",
    badImplementation: "badImplementation",
    unauthorized: "unauthorized",
     //to add the other error names
    
};

/* *
* range of usable data n° 1 ~ 15
* 5~10 for delegate layer
* */

const index = 5;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test"+index;
const validTokenId3 = "test" + index3;

/* good cases=====================================================================================================*/

//valid user_email
const valid_user_email = "test@gmail.com";

// valid examples
let validExample = {
    "project_id": index,
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};


describe('good cases on filters.delegate ', () => {

    test('filters.delegate.insert() adds a new filter to the db', async () => {
        jest.setTimeout(timeOut);
        let filter = await filtersDelegate.insert(valid_user_email, validExample.filter, validExample.project_id);
        expect(parseInt(filter.project_id)).toBe(validExample.project_id);
        expect(filter.data).toMatchObject(validExample.filter)
    });

});

/* bad cases==============================================================================================================*/


//not valid examples
let notValidExampleForProjectId = {
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};
let notValidExampleForProjectIdNotNumber = {
    "project_id": "abc",
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};
let notValidExampleForProjectIdNotInteger = {
    "project_id": "1.5",
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};
let notValidExampleForExclusionDescription = {
    "project_id": index + "",
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
    }
};


let notValidExampleForProjectIdNotExist = {
    "project_id": "9999",
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};
let notValidExampleForProjectIdNotPermission = {
    "project_id": index3 + "",
    "filter": {
        "predicate": "aaa",
        "inclusion_description": "bbb",
        "exclusion_description": "ccc",
    }
};


/*bad cases*/
describe('bad cases on filters.delegate ', () => {

    describe('bad cases filters.delegate.insert()', () => {

        test('it should return error \'badRequest\' if parameters are not valid', async () => {
            jest.setTimeout(timeOut);
            let filter = undefined;

            //project Id is not defined
            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForProjectId.filter, notValidExampleForProjectId.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //project Id is not a number
            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForProjectIdNotNumber.filter, notValidExampleForProjectIdNotNumber.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //project Id is not an integer
            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForProjectIdNotInteger.filter, notValidExampleForProjectIdNotInteger.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

            //a mandatory field is missing
            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForExclusionDescription.filter, notValidExampleForExclusionDescription.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.badRequest);

        });

        test('it should return \'unauthorized\' if the project doesn\'t exist', async () => {
            jest.setTimeout(timeOut);

            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForProjectIdNotExist.filter, notValidExampleForProjectIdNotExist.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.unauthorized);

        });

        test('it should return \'unauthorized\' if the user does not have access', async () => {
            jest.setTimeout(timeOut);

            try{
                filter = await filtersDelegate.insert(valid_user_email, notValidExampleForProjectIdNotPermission.filter, notValidExampleForProjectIdNotPermission.project_id);
            }catch(e){
                filter = e;
            }
            expect(filter.name).toBe(errorNames.unauthorized);

        });

    });


});