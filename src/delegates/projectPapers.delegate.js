// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const projectPapersDao = require(__base + 'dao/projectPapers.dao');
const errHandler = require(__base + 'utils/errors');
//supply the ausiliar function
const support = require(__base + 'utils/support');
//the packaged for input validation
const validationSchemes = require(__base + 'utils/validation.schemes');
const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * insert a projectPaper
 * @param {integer} paper_id
 * @param {integer} project_id
 * @param {object} newProjectPaperData
 * @returns {object} projectPaper created
 */
async function insert(paper_id, project_id, newProjectPaperData) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }

    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new projectPaper data is not valid!');
    }
    //call DAO layer
    let res = await projectPapersDao.insert(paper_id, project_id, newProjectPaperData);

    return  res;
}


/**
 *  * update a projectPaper
 * @param {integer} paper_id
 * @param {integer}  project_id
 * @param {object} newProjectPaperData
 
 */
async function update(paper_id, project_id, newProjectPaperData) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }
    
    //check input format
    let valid = ajv.validate(validationSchemes.projectPaper, newProjectPaperData);
    //if is not a valid input
    if (!valid)
    {
        throw errHandler.createBadRequestError('the new projectPaper data for update is not valid!');
    }
    //call DAO layer
    let numberRow = await projectPapersDao.update(paper_id, project_id, newProjectPaperData);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }

}


/**
 *  * delete a projectPaper
 * @param {integer} paper_id
 * @param {integer} project_id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(paper_id, project_id) {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }
    
    //call DAO layer
    let numberRow = await projectPapersDao.deletes(paper_id, project_id);
    //error check
    if (numberRow === 0)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
}


/**
 * select a projectPaper
 * @param {integer} paper_id
 * @param {integer} project_id
 * @returns {object} projectPaper found
 */
async function selectById(paper_id, project_id)  {
    //error check
    if (paper_id === undefined || paper_id === null)
    {
        throw errHandler.createBadRequestError('Paper id is not defined!');
    }
    //cast projectPaper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id))
    {
        throw errHandler.createBadRequestError('Paper id  is not a integer!');
    }
    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }
    
    //call DAO layer
    let res = await projectPapersDao.selectById(paper_id, project_id);
    //error check
    if (res === undefined)
    {
        throw errHandler.createNotFoundError('ProjectPaper does not exist!');
    }
    return res;
}

/**
 * select all projectPaper associated with a project
 * @param {integer} project_id
 * @param {integer} number number of projectPapers
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projectPapers 
 */
async function selectByProject(project_id, number, offset, orderBy, sort) {

    //error check
    if (project_id === undefined || project_id === null)
    {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id))
    {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }

    //cast number to integer type
    number = Number(number);
    //cast offset to integer type
    offset = Number(offset);

    //will return not empty string if they are not valid 
    let errorMessage = support.areValidListParameters(number, offset, orderBy, sort);
    if (errorMessage !== "")
    {
        throw errHandler.createBadRequestError(errorMessage);
    }

    //call DAO layer
    let res = await projectPapersDao.selectByProject(project_id, number, offset, orderBy, sort);
    //error check
    if (res.length === 0)
    {
        throw errHandler.createNotFoundError('the list is empty!');
    }
    return res;
}




module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectByProject
};