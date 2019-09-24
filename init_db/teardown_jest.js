/*file to destory DB temp for test*/

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
            if (err) {
                reject(console.log(err));
            }
            else {
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
 * function to destroy the DB tmp
 */
async function destroyDB() {

    //get destroy sql
    var destroySql = await read('src/db/destroy.sql').then(returnData);
    //excute destroy sql
    await db.queryNotParameter(destroySql).catch(function (error) {
        console.error(error);
    });
    //close db connection;
    await db.end();
    console.log("=====database destroyed=====");

}


module.exports = destroyDB;
