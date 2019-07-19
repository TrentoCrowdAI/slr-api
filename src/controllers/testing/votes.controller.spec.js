const request = require('supertest');
const app = require(__base + 'app');
//the config file
const config = require(__base + 'config');
const timeOut = 20 * 1000;


/* range of usable data n° 25 ~ 27 */
const index = 25;
const index2 = index + 1;
const index3 = index + 2;
const validTokenId = "test" + index;
const validTokenId2 = "test" + index2;
const validTokenId3 = "test" + index3;


/* good cases=====================================================================================================*/

const validExample = {
    "project_paper_id": index2,
    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};


describe('good cases on votes', () => {


    test('POST /votes should return 201', async () => {
        jest.setTimeout(timeOut);
        response = await request(app).post('/votes').send(validExample).set('Authorization', validTokenId);
        expect(response.status).toBe(201);
    });


    test('GET /votes should return 200', async () => {
        jest.setTimeout(timeOut);
        let response = await request(app).get('/votes?project_id=' + index).set('Authorization', validTokenId);
        expect(response.status).toBe(200);
    });


});


/* bad cases==============================================================================================================*/






const notValidExampleForProjectPaperIdNotNumber = {
    "project_paper_id": "abc",

    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};
const notValidExampleForProjectPaperIdNotInteger = {
    "project_paper_id": index3 + ".5",

    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};

const notValidExampleForVoteDataNotExist = {
    "project_paper_id": index3,

};

const notValidExampleForVoteDataNotValid = {
    "project_paper_id": index3,
    "vote": "abc"
};

const notValidExampleForVoteAnswerNotValid = {
    "project_paper_id": index3,
    "vote": {
        "answer": "abc",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};

const notValidExampleForProjectPaperNotExist = {
    "project_paper_id": 9999,
    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};


//use token3
const notValidExampleForProjectNotPermission = {
    "project_paper_id": index2,
    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};

//use token3
const notValidExampleForNotScreening = {
    "project_paper_id": index,
    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};

const notValidExampleForAlreadyVoted = {
    "project_paper_id": index,
    "vote": {
        "answer": "1",
        "metadata": {
            "type": "multi-predicate",
            "highlights": [
                {
                    "text": {},
                    "filter_id": "0"
                }
            ],
            "tags": [],
        }
    }
};



describe('bad cases on votes', () => {



    describe('bad cases on POST /votes', () => {

        test('POST /votes should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);


            //the project i paper id is not a number
            response = await request(app).post('/votes').send(notValidExampleForProjectPaperIdNotNumber).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the project i paper id is not a integer
            response = await request(app).post('/votes').send(notValidExampleForProjectPaperIdNotInteger).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the vote data is not exist
            response = await request(app).post('/votes').send(notValidExampleForVoteDataNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //the vote data is not valid
            response = await request(app).post('/votes').send(notValidExampleForVoteDataNotValid).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

            //the vote answer is not valid
            response = await request(app).post('/votes').send(notValidExampleForVoteAnswerNotValid).set('Authorization', validTokenId);
            expect(response.status).toBe(400);

        });


        test('POST /votes should return 404 if projectPaper is not exist', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/votes').send(notValidExampleForProjectPaperNotExist).set('Authorization', validTokenId);
            expect(response.status).toBe(404);
        });



        //the user haven't permission
        test('POST /votes should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/votes').send(notValidExampleForProjectNotPermission).set('Authorization', validTokenId3);
            expect(response.status).toBe(401);
        });

        //the user is not a screener of this project
        test('POST /votes should return 400 if user isn\'t screener', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/votes').send(notValidExampleForNotScreening).set('Authorization', validTokenId3);
            expect(response.status).toBe(400);
        });




        test('POST /votes should return 400 if user already voted', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).post('/votes').send(notValidExampleForAlreadyVoted).set('Authorization', validTokenId);



            expect(response.status).toBe(400);
        });
        

    });


    describe('bad cases on GET /votes', () => {

        test('GET /votes should return 400 if parameters aren\'t valid', async () => {
            jest.setTimeout(timeOut);
            //if the project id is not a number
            let response = await request(app).get('/votes?project_id=abc').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
            //if the project id is not a integer
            response = await request(app).get('/votes?project_id=' + index + '.5').set('Authorization', validTokenId);
            expect(response.status).toBe(400);
        });


        test('GET /votes should return 401 if it finds nothing', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/votes?project_id=9999').set('Authorization', validTokenId);
            expect(response.status).toBe(401);
        });

        test('GET /votes should return 401 if user hasn\'t permission', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/votes?project_id=' + index).set('Authorization', validTokenId2);
            expect(response.status).toBe(401);
        });

        test('GET /votes should return 404 if project hasn\'t vote', async () => {
            jest.setTimeout(timeOut);
            let response = await request(app).get('/votes?project_id=' + index3).set('Authorization', validTokenId3);
            expect(response.status).toBe(404);
        });


    });




});