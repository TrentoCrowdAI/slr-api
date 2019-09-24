const timeOut = 60 * 1000;
const db = require(__base + "db/index");
const externalServicesDelegate = require(__base + 'delegates/external.services.delegate');


/* *
 * external service
 * use test data of upload file
 * range of usable data n° 61~ 75
 * 66~70 for delegate layer
 * */

const index = 66;
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


describe('test cases on external.services.delegate ', () => {


    test('fakeSimilarSearchService()', async () => {

        //


        let paperData = {
            "title": "machine learning",
        };
        let start = 10;
        let count = 5;


        let res = await externalServicesDelegate.fakeSimilarSearchService(paperData, start, count);
        expect(res.results.length).toBe(5);
        expect(res.results[0].title).toBeDefined();


    });

    test('fakeAutomatedSearchService()', async () => {


        let title = "machine learning";
        let description = "scientific study";
        let arrayFilter = [
            {
                "id": 1,
                "data": {
                    "name": "C1",
                    "predicate": "avc",
                    "inclusion_description": "microsoft",
                    "exclusion_description": "mac",
                },
                "project_id": index,
            },
        ];
        let min_confidence = 0.0;
        let max_confidence = 1.0;
        let start = 0;
        let count = 5;


        let res = await externalServicesDelegate.fakeAutomatedSearchService(title, description, arrayFilter, min_confidence, max_confidence, start, count);
        expect(res.results.length).toBe(5);
        expect(res.results[0].metadata.automatedSearch).toBeDefined();
    });


    test('fakeAutomatedEvaluationService()', async () => {


        let arrayPaper = [
            {
                "id": index,
            },
            {
                "id": index2,
            },

        ];
        let arrayFilter = [
            {
                "id": index,
                "data": {
                    "name": "C1",
                    "predicate": "avc",
                    "inclusion_description": "android",
                    "exclusion_description": "mac",
                },
                "project_id": index,
            },
            {
                "id": index2,
                "data": {
                    "name": "C2",
                    "predicate": "avb",
                    "inclusion_description": "harmony",
                    "exclusion_description": "windows",
                },
                "project_id": index2,
            },
        ];
        let project_id = index;


        let res = await externalServicesDelegate.fakeAutomatedEvaluationService(arrayPaper, arrayFilter, project_id);
        expect(res.length).toBe(2);
        expect(res[0].value).toBeDefined();
        expect(res[0].filters.length).toBe(2);
    });


    test('fakeGetAutomatedScreeningStatus()', async () => {


        let project_id = index2;
        let res = await externalServicesDelegate.fakeGetAutomatedScreeningStatus(project_id);
        expect(res).toBe(true);


    });

});
