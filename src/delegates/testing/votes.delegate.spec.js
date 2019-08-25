const timeOut = 60 * 1000;
const delayTime = timeOut/2;

const votesDelegate = require(__base + 'delegates/votes.delegate');
//the config file
const config = require(__base + 'config');


/* *
* votes
* range of usable data n° 121~ 135
* 126~130 for delegate layer
* */


const index = 126;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validUserEmail = "test"+index+"@gmail.com";
const validUserEmail2 = "test"+index2+"@gmail.com";
const validUserEmail3 = "test"+index3+"@gmail.com";
const validUserEmail4 = "test"+index4+"@gmail.com";
const validUserEmail5 = "test"+index5+"@gmail.com";




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



const voteData = {
    "metadata": {
        "type": "multi-predicate",
        "highlights": [
            {
                "outcome": "0"
            }
        ],
        "tags": []
    }
};


describe('test cases on votes.dao ', () => {

    test('insert()', async () => {


        let project_paper_id = index;


        let res = await votesDelegate.insert(validUserEmail2, voteData, project_paper_id);

        expect(parseInt(res.project_paper_id)).toBe(project_paper_id);

    });



    test('selectByProjectId()', async () => {


        let project_id = index;

        let res = await votesDelegate.selectByProjectId(validUserEmail, project_id);

        expect(parseInt(res.length)).toBe(2);
        expect(parseInt(res[0].project_id)).toBe(project_id);

    });



});