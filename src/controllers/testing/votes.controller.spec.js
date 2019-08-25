const request = require('supertest');
const app = require(__base + 'app');
const timeOut = 30 * 1000;
const db = require(__base + "db/index");

//the config file
const config = require(__base + 'config');

/* *
* votes
* range of usable data n° 121~ 135
* 121~125 for controller layer
* */

const index = 121;
const index2 = index + 1;
const index3 = index + 2;
const index4 = index + 3;
const index5 = index + 4;
const validTokenId = "test" + index;
const validTokenId2 = "test" + index2;
const validTokenId3 = "test" + index3;
const validTokenId4 = "test" + index4;
const validTokenId5 = "test" + index5;



beforeEach(() => {
    jest.setTimeout(timeOut);
});
//after all test case
afterAll(() => {
    //close the db pool to reduce the number of connections
    db.end();
});

/* good cases=====================================================================================================*/


describe('good cases on votes', () => {


    test('POST /votes should return 201', async () => {


        const validExample = {
            "project_paper_id": index2,
            "vote": {
                "metadata": {
                    "type": "multi-predicate",
                    "highlights": [
                        {
                            "outcome": "0"
                        }
                    ],
                    "tags": [],
                }
            }
        };
        let response = await request(app).post('/votes').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });


    test('GET /votes should return 200', async () => {

        let response = await request(app).get('/votes?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


});


/* bad cases==============================================================================================================*/


describe('bad cases on votes', () => {


    describe('bad cases on POST /votes', () => {

        test('POST /votes should return 400 if parameters aren\'t valid', async () => {



            //the project i paper id is not a number
            const notValidExampleForProjectPaperIdNotNumber = {
                "project_paper_id": "abc",
                "vote": {
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            response = await request(app).post('/votes').send(notValidExampleForProjectPaperIdNotNumber).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the project i paper id is not a integer
            const notValidExampleForProjectPaperIdNotInteger = {
                "project_paper_id": index3 + ".5",
                "vote": {
                    "answer": "1",
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            response = await request(app).post('/votes').send(notValidExampleForProjectPaperIdNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the vote data is not exist
            const notValidExampleForVoteDataNotExist = {
                "project_paper_id": index3,
            };
            response = await request(app).post('/votes').send(notValidExampleForVoteDataNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the vote data is not valid
            const notValidExampleForVoteDataNotValid = {
                "project_paper_id": index3,
                "vote": "abc"
            };
            response = await request(app).post('/votes').send(notValidExampleForVoteDataNotValid).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /votes should return 404 if projectPaper is not exist', async () => {


            const notValidExampleForProjectPaperNotExist = {
                "project_paper_id": 9999,
                "vote": {
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            let response = await request(app).post('/votes').send(notValidExampleForProjectPaperNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });


        test('POST /votes should return 400 if the projectPaper is already screened', async () => {


            const notValidExampleForAlreadyScreened = {
                "project_paper_id": index2,
                "vote": {
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            let response = await request(app).post('/votes').send(notValidExampleForAlreadyScreened).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        //the user haven't permission
        test('POST /votes should return 401 if user hasn\'t permission', async () => {


            //use token3
            const notValidExampleForProjectNotPermission = {
                "project_paper_id": index3,
                "vote": {
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            let response = await request(app).post('/votes').send(notValidExampleForProjectNotPermission).set('Authorization', validTokenId2);
            expect(response.status).toBe(401);
        });

        //the user is not a screener of this project
        test('POST /votes should return 400 if user isn\'t screener', async () => {


            //use token3
            const notValidExampleForNotScreening = {
                "project_paper_id": index3,
                "vote": {

                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };
            let response = await request(app).post('/votes').send(notValidExampleForNotScreening).set('Authorization', validTokenId3);
            expect(response.status).toBe(400);
        });


        test('POST /votes should return 400 if user already voted', async () => {


            const notValidExampleForAlreadyVoted = {
                "project_paper_id": index,
                "vote": {
                    "metadata": {
                        "type": "multi-predicate",
                        "highlights": [
                            {
                                "outcome": "0"
                            }
                        ],
                        "tags": [],
                    }
                }
            };

            let response = await request(app).post('/votes').send(notValidExampleForAlreadyVoted).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


    });


    describe('bad cases on GET /votes', () => {

        test('GET /votes should return 400 if parameters aren\'t valid', async () => {

            //if the project id is not a number
            let response = await request(app).get('/votes?project_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //if the project id is not a integer
            response = await request(app).get('/votes?project_id=' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('GET /votes should return 401 if it finds nothing', async () => {

            let response = await request(app).get('/votes?project_id=9999').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('GET /votes should return 401 if user hasn\'t permission', async () => {

            let response = await request(app).get('/votes?project_id=' + index).set('Authorization', validTokenId2);
            expect(response.status).toBe(401);
        });

        test('GET /votes should return 404 if project hasn\'t vote', async () => {

            let response = await request(app).get('/votes?project_id=' + index5).set('Authorization', validTokenId5);
            expect(response.status).toBe(404);
        });


    });


});