// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

//file system
const fs = require('fs');
//csv parser
const csv = require('async-csv');


//the config file
const config = require(__base + 'config');
//error handler
const errHandler = require(__base + 'utils/errors');
//supply the auxiliary function
const support = require(__base + 'utils/support');
//fetch request
const conn = require(__base + 'utils/conn');
//error check function
const errorCheck = require(__base + 'utils/errorCheck');
//the packaged for input validation
const ajv = require(__base + 'utils/ajv');
const validationSchemes = require(__base + 'utils/validation.schemes');


const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const projectsDao = require(__base + 'dao/projects.dao');
const usersDao = require(__base + 'dao/users.dao');


/**
 * send the pdf file to remote service and return the result of parse
 * @param {file}file
 * @return {Object} result of parse
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
    result.authors = support.arrayOfObjectToString(response.authors, "name", ",", "");

    return result;


}


/**
 * parse the csv file
 * @param {Object} fields
 * @param {file}file
 * @return {array[]} list of projectPaper created
 */
async function parseCsv(user_email, project_id, fields, file) {

    //error check

    //error check for user_email
    errorCheck.isValidGoogleEmail(user_email);
    //check validation of project id and transform the value in integer
    project_id = errorCheck.setAndCheckValidProjectId(project_id);

    //get user info
    let user = await usersDao.getUserByEmail(user_email);
    //check relationship between the project and user
    let project = await projectsDao.selectByIdAndUserId(project_id, user.id);
    //if the user isn't project's owner
    errorCheck.isValidProjectOwner(project);

    //check fields

    if (!fields) {
        throw errHandler.createBadRequestError('the parameter "fields" does not exist!');
    }

    //parse in object
    fields = JSON.parse(fields);
    let valid = ajv.validate(validationSchemes.csvPaperFields, fields);
    //if is not a valid input
    if (!valid) {
        throw errHandler.createBadRequestError('the fields is not valid!');
    }

    //if the file doesn't exist
    if (!file) {
        throw errHandler.createBadRequestError('the file does not exist!');
    }
    //if the file doesn't a pdf
    if (file.mimetype.indexOf("csv") === -1) {
        throw errHandler.createBadRequestError('the file is not a csv!');
    }

    //get the text content from file
    let csvText = fs.readFileSync(file.path, "utf8");
    //parses it
    let csvBody;
    try {
        csvBody = await csv.parse(csvText, {delimiter: ",", columns: true, skip_empty_lines: true});
    }
    catch (e) {
        throw errHandler.createBadRequestError('Error from CSV parser: ' + e.message);
    }
    //error check
    //if is null or isn't a array
    if (!csvBody || !Array.isArray(csvBody) || csvBody.length == 0) {

        throw errHandler.createBadRequestError('the file is not a valid csv with column headers!');
    }


    //create list of paper to insert into DB
    let listPaper = [];
    let arrayEid = [];

    for (let i = 0; i < csvBody.length; i++) {

        //get single paper object from csvObject
        let paper = {};
        paper["authors"] = csvBody[i][fields.authors] || "";
        paper["title"] = csvBody[i][fields.title] || "";
        paper["year"] = csvBody[i][fields.year] || "";
        paper["date"] = csvBody[i][fields.date] || "";
        paper["source_title"] = csvBody[i][fields.source_title] || "";
        paper["link"] = csvBody[i][fields.link] || "";
        paper["abstract"] = csvBody[i][fields.abstract] || "";
        paper["document_type"] = csvBody[i][fields.document_type] || "";
        paper["source"] = csvBody[i][fields.source] || "";
        paper["eid"] = csvBody[i][fields.eid] || "";
        paper["abstract_structured"] = csvBody[i][fields.abstract_structured] || "";
        paper["filter_oa_include"] = csvBody[i][fields.filter_oa_include] || "";
        paper["filter_study_include"] = csvBody[i][fields.filter_study_include] || "";
        paper["notes"] = csvBody[i][fields.notes] || "";
        paper["manual"] = csvBody[i][fields.manual] || "";
        paper["doi"] = csvBody[i][fields.doi] || "";

        //push it in list
        listPaper.push(paper);
        //save the eid for successive checking
        arrayEid.push(paper["eid"]);
    }

    //get array of eids where they are already presented in DB
    let arrayEidExisting = await projectPapersDao.checkExistenceByEids(arrayEid, project_id);
    //remove the paper with eids already exist in DB
    listPaper = support.differenceOperationByField(listPaper, arrayEidExisting, "eid");


    let result = {};

    //if at least one post will be inserted
    if (listPaper.length > 0) {
        result = await projectPapersDao.insertByList(listPaper, project_id);
        //update the last modified date of project
        await projectsDao.updateLastModifiedDate(project_id);
    }

    return result;


}


module.exports = {

    parsePdf,
    parseCsv,
};