// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

//file system
const fs = require('fs');

//the config file
const config = require(__base + 'config');
//error handler
const errHandler = require(__base + 'utils/errors');
//fetch request
const conn = require(__base + 'utils/conn');



async function parsePdf(file) {

    //error check
    if(!file){
        throw errHandler.createBadRequestError('the file is not exist!');
    }
    if(file.mimetype.indexOf("application/pdf")=== -1){
        throw errHandler.createBadRequestError('the file is not a pdf!');
   }

    //console.log('type：%s', file.mimetype);
    //console.log('name：%s', file.originalname);
    //console.log('size：%s', file.size);
    //console.log('path：%s', file.path);

    //fetch with file stream
    let response = await conn.postPdf(config.pdf_parse_server, fs.createReadStream(file.path));

    //if there is the error from fetch
    if (response.message) {
        throw errHandler.createBadImplementationError(response.message);
    }

    //prepare the result
    let result={
        title: response.title,
        abstract : response.abstractText,
        year: response.year,
    };

    //get a string of author's name from array of authors
    result.authors = "";
    for(let i=0; i<response.authors.length; i++){
        result.authors += response.authors[i].name;
        if(i !== response.authors.length-1 ){
            result.authors += ",";
        }
    }

    return result;


}


module.exports = {

    parsePdf,
};