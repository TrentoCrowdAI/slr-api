// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

//file system
const fs = require('fs');

//the config file
const config = require(__base + 'config');
//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//fetch request
const conn = require(__base + 'utils/conn');


/**
 * send the pdf file to remote service and return the result of parse
 * @param {file}file
 * @return {object} result of parse
 */
async function parsePdf(file) {

    //error check
    //if the file doesn't exist
    if (!file) {
        throw errHandler.createBadRequestError('the file does not exist!');
    }
    //if the file doesn't a pdf
    if (file.mimetype.indexOf("application/pdf") === -1) {
        throw errHandler.createBadRequestError('the file is not a pdf!');
    }

    //send a post request with readStream of file, so file will be converted in the binary data in request
    let response = await conn.postPdf(config.pdf_parse_server, fs.createReadStream(file.path));

    //if there is the error from post request
    if (response.message) {
        throw errHandler.createBadImplementationError(response.message);
    }

    //prepare the result
    let result = {
        title: response.title,
        abstract: response.abstractText,
        year: response.year,
    };
    //format a string of author's name from array of authors
    result.authors = support.arrayOfObjectToString(response.authors, "name", "," , "");

    return result;


}


module.exports = {

    parsePdf,
};