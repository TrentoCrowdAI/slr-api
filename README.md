# slr-api

SLR, a system for supporting the search phase of systematic literature reviews. Backend layer. Frontend [here](https://github.com/TrentoCrowdAI/slr-web).



| master  | develop      |
|---------|-------------|
| [![Build Status](https://travis-ci.com/TrentoCrowdAI/slr-api.svg?branch=master)](https://travis-ci.com/TrentoCrowdAI/slr-api)    | [![Build Status](https://travis-ci.com/TrentoCrowdAI/slr-api.svg?branch=develop)](https://travis-ci.com/TrentoCrowdAI/slr-api) |



## deployment

### initial installation
- clone the repo ```git clone https://github.com/TrentoCrowdAI/slr-api.git && cd slr-api```
- *checkout on the develop branch  ```git checkout develop```*
- run ```npm install``` to install its modules
- copy file ".env.example" to ".env" and modify its variables

### initial database
- You need to connect an appropriate POSTGRES database by change the variable DATABASE_URL in .env file
- then run ```node init_db/setup.js``` to initialize the database


### calling the API
- run ```npm start``` to start the service
The server will be listening on ```http://localhost:3001/``` and you can find the documentation about the API calls [here](https://ese1.docs.apiary.io/#reference)


### testing
- copy file ".env.example" to ".env.test" and modify its variables
- run ```npm test``` to test
