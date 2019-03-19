/*file to initialize DB temp for test*/

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
 * easy function that return the input received
 * @param {string} data
 * @returns {string}
 */
function returnData(data) {
    return data;
}
/**
 * function to create the DB tmp and insert the data for test
 
 */
async function createDB() {
    
    //get init sql
    var initSql = await read('src/db/init.sql').then(returnData);
    //get data sql
    var dataSql = await read('src/db/test.data.sql').then(returnData);
    //excute init sql
    await db.queryNotParameter(initSql).catch (function(error){
        console.error(error);
    }) ;
    //exceute data sql
    await db.queryNotParameter(dataSql).catch (function(error){
        console.error(error);
    }) ;
    
    console.log("database initiated-------------------------------------------");
    
}

module.exports = createDB;
