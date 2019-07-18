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

    let path = "src/db/";
    //get destroy sql
    let destroySql = await read(path+'destroy.sql').then(returnData);
    //get init sql
    let initSql = await read(path+'init.sql').then(returnData);


    //get data sql
    let dataSql = [];
    dataSql.push(await read(path+'test.data.fake.papers.sql').then(returnData));
    dataSql.push(await read(path+'test.data.projects.sql').then(returnData));
    dataSql.push(await read(path+'test.data.projects.papers.sql').then(returnData));
    dataSql.push(await read(path+'test.data.filters.sql').then(returnData));
    dataSql.push(await read(path+'test.data.users.sql').then(returnData));
    dataSql.push(await read(path+'test.data.screenings.sql').then(returnData));
    dataSql.push(await read(path+'test.data.votes.sql').then(returnData));


    //destroy db
    await db.queryNotParameter(destroySql).catch(function (error) {
        console.error(error);
    });
    console.log("=====database destroyed=====");

    //init db
    await db.queryNotParameter(initSql).catch(function (error) {
        console.error(error);
    });
    console.log("=====database created=====");

    //execute test data sql
    for(let i=0; i<dataSql.length; i++){
        await db.queryNotParameter(dataSql[i]).catch(function (error) {
            console.error(error);
        });
    }


    console.log("=====database loaded with test data=====");

}

module.exports = createDB;
