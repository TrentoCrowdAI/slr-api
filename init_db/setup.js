/*file to initialize DB*/

//set root path
global.__base = __dirname + '/../src/';

//get environmental variables from default env file
require('dotenv').config();

const fs = require("fs");
const db = require(__base + "db/index");

/**
 * async function to read the file and return a promise object that contains the content of file
 * @param {string} dir dir of file
 * @returns {Promise}
 */
function read(dir) {
    return new Promise((resolve, reject) => {
        fs.readFile(dir, 'utf-8', (err, data) => {
            if (err)
            {
                reject(console.log(err));
            }
            else
            {
                resolve(data);
            }
        });
    });
}

/*
 * wrapper function that return the input received
 * @param {string} data
 * @returns {string}
 */
function returnData(data) {
    return data;
}

/**
 * function to create the DB and insert the default data
 */
async function createDB() {
    //set path of sql file
    let path = "src/db/";
    //get destroy sql
    let destroySql = await read(path+'destroy.sql').then(returnData);
    //get init sql
    var initSql = await read(path+'init.sql').then(returnData);
    //get data sql
    var dataSql = await read(path+'data.sql').then(returnData);

    //destroys db
    await db.queryNotParameter(destroySql).catch(function (error) {
        console.error(error);
    });
    console.log("=====database destroyed=====");

    //creates db
    await db.queryNotParameter(initSql).catch (function(error){
        console.error(error);
    }) ;
    console.log("=====database created=====");


    //inserts data
    await db.queryNotParameter(dataSql).catch (function(error){
        console.error(error);
    }) ;
    console.log("=====database loaded with initial data=====");
    
}

createDB();