const errHandler = require(__base + 'utils/errors');
//the config file
const config = require(__base + 'config');
//the format of valid input
const validationSchemes = require(__base + 'utils/validation.schemes');


/**
 * check validation of paper id and transform the value in integer
 * @param {number} paper_id
 * @return {int} paper_id
 */
function setAndCheckValidPaperId(paper_id) {
    //error check
    if (paper_id === undefined || paper_id === null) {
        throw errHandler.createBadRequestError('paper_id is not defined!');
    }
    //cast paper_id to integer type
    paper_id = Number(paper_id);
    //error check
    if (!Number.isInteger(paper_id)) {
        throw errHandler.createBadRequestError('paper_id is not a integer!');
    }
    return paper_id;
}


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
    if (start !== undefined) {
        start = Number(start);
    }
    else {
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

    if (count !== undefined) {
        count = Number(count)
    }
    else {
        count = config.pagination.defaultCount;
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
 * set a default value if orderBy isn't defined and check its validation
 * @param {string} orderBy
 * @return {string} valid orderBy
 */
function setAndCheckValidOrderByForScopus(orderBy) {

    orderBy = orderBy || "title";
    if (orderBy !== "date" && orderBy !== "title" ) {
        throw errHandler.createBadRequestError('orderBy has a not valid value!');
    }
    return orderBy;
}

/**
 * set a default value if orderBy isn't defined and check its validation
 * @param {string} searchBy
 * @return {string} valid searchBy
 */
function setAndCheckValidSearchByForScopus(searchBy) {

    searchBy = searchBy || "all";
    //if the value doesn't correspond to any default value
    if (!config.validSearchBy.includes(searchBy)) {
        throw errHandler.createBadRequestError('searchBy has a not valid value!');
    }
    return searchBy;
}

/**
 * set a default empty string if year isn't defined and check its validation
 * @param {string} searchBy
 * @return {string} valid searchBy
 */
function setAndCheckValidYearForScopus(year) {

    year = Number(year) || "";
    if (year !== "" && !Number.isInteger(year)) {
        throw errHandler.createBadRequestError('year has a not valid value!');
    }

    return year;
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

/**
 * check the validation of token_id
 * @param {String} tokenId
 */
function isValidTokenId(tokenId) {

    //if it is empty or a "null" string
    if (!tokenId || tokenId === 'null') {
        throw errHandler.createBadRequestError("empty token id in header, the user must first login!");
    }

}

/**
 * check the validation of google_id
 * @param {String} google_id
 */
function isValidGoogleId(google_id) {

    //if it is empty or a "null" string
    if (!google_id) {
        throw errHandler.createBadRequestError("empty google id");
    }

}


/**
 * check if the project is empty
 * @param {Object} project
 */
function isValidProjectOwner(project) {

    //if it is empty
    if (!project) {
        throw errHandler.createUnauthorizedError("unauthorized operation");
    }

}

/**
 * check if the projectPaper is empty
 * @param {Object} projectPaper
 */
function isValidProjectPaper(projectPaper) {

    //if it is empty
    if (!projectPaper) {
        throw errHandler.createUnauthorizedError("ProjectPaper does not exist!");
    }

}


module.exports = {
    setAndCheckValidPaperId,
    setAndCheckValidProjectId,
    setAndCheckValidProjectOrderBy,
    setAndCheckValidProjectPaperId,
    setAndCheckValidProjectPaperOrderBy,
    setAndCheckValidSort,
    setAndCheckValidStart,
    setAndCheckValidCount,
    setAndCheckValidOrderByForScopus,
    setAndCheckValidSearchByForScopus,
    setAndCheckValidYearForScopus,
    isValidKeyword,
    isValidArray,
    isValidTokenId,
    isValidGoogleId,
    isValidProjectOwner,
    isValidProjectPaper,


};