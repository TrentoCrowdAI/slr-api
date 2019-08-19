const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 20 * 1000;

const votesDao = require(__base + 'dao/votes.dao');
//the config file
const config = require(__base + 'config');


/* *
* votes
* range of usable data n° 121~ 135
* 131~135 for dao layer
* */


const index = 131;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;


// valid examples
const newVoteData = {
        "answer": 1,
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "outcome": "0"
                }
            ],
        }
};


describe('test cases on votes.dao ', () => {

    test('insert()', async () => {
        jest.setTimeout(timeOut);

        let user_id = index;
        let project_paper_id = index2;
        let project_id = index2;

        let res = await votesDao.insert(newVoteData, user_id, project_paper_id, project_id);

        expect(res.data).toMatchObject(newVoteData);

    });

    test('update()', async () => {
        jest.setTimeout(timeOut);

        let vote_id = index;

        let res = await votesDao.update(vote_id, newVoteData);

        expect(parseInt(res)).toBe(1);

    });


    test('deletes()', async () => {
        jest.setTimeout(timeOut);

        let vote_id = index5;

        let res = await votesDao.deletes(vote_id);

        expect(parseInt(res)).toBe(1);

    });

    test('deleteByProjectIdAndUserId()', async () => {
        jest.setTimeout(timeOut);


        let user_id = index;
        let project_id = index2;

        let res = await votesDao.deleteByProjectIdAndUserId(project_id, user_id);

        expect(parseInt(res)).toBe(1);

    });


    test('selectById()', async () => {
        jest.setTimeout(timeOut);


        let vote_id = index;

        let res = await votesDao.selectById(vote_id);

        expect(parseInt(res.id)).toBe(vote_id);
        expect(res.data).toMatchObject(newVoteData);

    });

    test('selectByUserId()', async () => {
        jest.setTimeout(timeOut);

        let user_id = index;

        let res = await votesDao.selectByUserId(user_id);

        expect(parseInt(res.length)).toBe(1);


    });

    test('selectByProjectPaperId()', async () => {
        jest.setTimeout(timeOut);

        let projectPaper_id = index;

        let res = await votesDao.selectByProjectPaperId(projectPaper_id);

        expect(parseInt(res.length)).toBe(1);


    });

    test('selectByProjectId()', async () => {
        jest.setTimeout(timeOut);

        let project_id = index;

        let res = await votesDao.selectByProjectId(project_id);

        expect(parseInt(res.length)).toBe(1);


    });



    test('selectByProjectPaperIdAndUserId()', async () => {
        jest.setTimeout(timeOut);

        let projectPaper_id = index;
        let user_id = index;

        let res = await votesDao.selectByProjectPaperIdAndUserId(projectPaper_id, user_id);

        expect(parseInt(res.project_paper_id)).toBe(index);
        expect(parseInt(res.user_id)).toBe(index);

    });

});