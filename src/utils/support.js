const errHandler = require(__base + 'utils/errors');
//the config file
const config = require(__base + 'config');
//the format of valid input
const validationSchemes = require(__base + 'utils/validation.schemes');

/**
 * transform a array to string
 * @param arraySource source array
 * @param separator separator between element
 * @param surroundedBy symbols that surround the element
 * @return {string} toString of array
 */
function arrayToString(arraySource, separator, surroundedBy) {

    let output = "";
    for (let i = 0; i < arraySource.length; i++) {
        output += surroundedBy + arraySource[i] + surroundedBy;
        //if isn't last cycle, add a comma ad end of string
        if (i < arraySource.length - 1) {
            output += separator;
        }
    }

    return output;

}

/**
 * difference operation of two arrays A - B
 * @param arrayA array A
 * @param arrayB array B
 * @return {array[]} result of difference
 */
function differenceOperation(arrayA, arrayB) {

    //return true if exist, false if not
    function checkExistenceOfElement(element){
        return !arrayB.includes(element);
    }
    //create a new array where includes only the element that isn't present in arrayB
    let newArray = arrayA.filter(checkExistenceOfElement);
    return newArray;
}


/**
 * remove paper object from array by a list of eids
 * @param arrayA array papers
 * @param arrayB array eids
 * @return {array[]} new array papers
 */
function removeElementFromArrayByEids(arrayA, arrayB)
{

    //return true if exist, false if not
    function checkExistenceOfElement(element) {
        return !arrayB.includes(element.eid);
    }

    //create a new array where includes only the element that isn't present in arrayB
    let newArray = arrayA.filter(checkExistenceOfElement);
    return newArray;

}
/*------------------------------------------------------------------------------------------------------------------------------------------------*/


/**
 * check validation of paper id and transform the value in integer
 * @param {number} paper_id
 * @return {int} paper_id
 */
function setAndCheckValidPaperId(paper_id) {
    //error check
    if (paper_id === undefined || paper_id === null) {
        throw errHandler.createBadRequestError('projectPaper_id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id)) {
        throw errHandler.createBadRequestError('paper_id is not a integer!');
    }
    return paper_id;
}





/*------------------------------------------------------------------------------------------------------------------------------------------------*/



/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * check validation of project id and transform the value in integer
 * @param {number} project_id
 * @return {int} project_id
 */
function setAndCheckValidProjectId(project_id) {
    //error check
    if (project_id === undefined || project_id === null) {
        throw errHandler.createBadRequestError('Project id is not defined!');
    }
    //cast project_id to integer type
    project_id = Number(project_id);
    //error check
    if (!Number.isInteger(project_id)) {
        throw errHandler.createBadRequestError('Project id is not a integer!');
    }
    return project_id;
}

/**
 * set a default value if orderBy of project isn't defined and check its validation
 * @param {string} orderBy
 * @return {string} orderBy
 */
function setAndCheckValidProjectOrderBy(orderBy) {

    //set default value if isn't defined
    orderBy = orderBy || "id";
    //check its validation
    if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted")) {
        throw errHandler.createBadRequestError('the orderBy has a not valid value!');
    }

    return orderBy;
}


/*------------------------------------------------------------------------------------------------------------------------------------------------*/


/**
 * check validation of projectPaper id and transform the value in integer
 * @param {number} projectPaper_id
 * @return {int} projectPaper_id
 */
function setAndCheckValidProjectPaperId(projectPaper_id) {
    //error check
    if (projectPaper_id === undefined || projectPaper_id === null) {
        throw errHandler.createBadRequestError('projectPaper_id is not defined!');
    }
    //cast project_id to integer type
    projectPaper_id = Number(projectPaper_id);
    //error check
    if (!Number.isInteger(projectPaper_id)) {
        throw errHandler.createBadRequestError('projectPaper_id is not a integer!');
    }
    return projectPaper_id;
}

/**
 * set a default value if orderBy of projectPaper isn't defined and check its validation
 * @param {string} orderBy
 * @return {string} orderBy
 */
function setAndCheckValidProjectPaperOrderBy(orderBy) {

    //set default value if isn't defined, set the default value
    orderBy = orderBy || "date_created";
    //get array that includes all properties name of a projectPaper
    let arrayKeys = Object.keys(validationSchemes.projectPaper.properties);
    //if orderBy isn't included in this array, and isn't "date_created"
    if (!arrayKeys.includes(orderBy) && orderBy !== "date_created") {
        throw errHandler.createBadRequestError('the orderBy has a not valid value!');
    }

    return orderBy;
}




/*------------------------------------------------------------------------------------------------------------------------------------------------*/




/**
 *  set a default value if sort isn't defined and check its validation
 * @param {string} sort
 * @return {string} a valid sort
 */
function setAndCheckValidSort(sort) {

    //set default value if isn't defined
    sort = sort || "DESC";
    //check its validation
    if (sort !== "ASC" && sort !== "DESC") {
        throw errHandler.createBadRequestError('sort has a not valid value!');
    }

    return sort;

}

/**
 * set a default value if start isn't defined and check its validation
 * @param {number} start
 * @return {int} a valid start
 */
function setAndCheckValidStart(start) {

    //set default value as 0 if isn't defined
    if(start !== undefined){
        start = Number(start);
    }
    else{
        start = 0;
    }

    //check its validation
    //if isn't a integer or is < 0
    if (!Number.isInteger(start) || start < 0) {
        throw errHandler.createBadRequestError('start has a not valid value!');
    }

    return start;
}

/**
 * set a default value if count isn't defined and check its validation
 * @param {number} count
 * @return {int} a valid count
 */
function setAndCheckValidCount(count) {

    if(count !== undefined){
        count = Number(count)
    }
    else{
        count =config.pagination.defaultCount;
    }

    //check its validation
    //if isn't a integer or is < 0
    if (!Number.isInteger(count)) {
        throw errHandler.createBadRequestError('the count has a not valid value!');
    }
    if (count < 1 || count > 25) {
        throw errHandler.createBadRequestError('the count of elements should be greater than 0 and lower than 25'); // 25 is max for no-subscriber scopus
    }

    return count;
}


/**
 * check the validation of keyword
 * @param {string} keyword
 */
function isValidKeyword(keyword) {

    //if it isn't defined
    if (keyword === undefined || keyword === null) {
        throw errHandler.createBadRequestError('the keyword is not define!');
    }
    //if it is empty
    if (keyword === "") {
        throw errHandler.createBadRequestError('the keyword is empty!');
    }

}

/**
 * check the validation of array
 * @param {Array[]}array
 */
function isValidArray(array) {

    //if it isn't a array
    if (Array.isArray(array) === false) {
        throw errHandler.createBadRequestError('the parameter isn\'t a array!');
    }
    //if it is empty
    if (array.length === 0) {
        throw errHandler.createBadRequestError('the array is empty!');
    }

}


module.exports = {
    arrayToString,
    differenceOperation,
    removeElementFromArrayByEids,
    setAndCheckValidPaperId,
    setAndCheckValidProjectId,
    setAndCheckValidProjectOrderBy,
    setAndCheckValidProjectPaperId,
    setAndCheckValidProjectPaperOrderBy,
    setAndCheckValidSort,
    setAndCheckValidStart,
    setAndCheckValidCount,
    isValidKeyword,
    isValidArray,

};