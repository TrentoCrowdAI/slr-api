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
 * check validation of filter id and transform the value in integer
 * @param {number} filter_id
 * @return {int} filter_id
 */
function setAndCheckValidFilterId(filter_id) {
    //error check
    if (filter_id === undefined || filter_id === null) {
        throw errHandler.createBadRequestError('filter_id is not defined!');
    }

    //cast filter_id to integer type
    filter_id = Number(filter_id);
    //error check
    if (!Number.isInteger(filter_id)) {
        throw errHandler.createBadRequestError('filter_id is not a integer!');
    }

    return filter_id;
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
    if (count < 1) {
        throw errHandler.createBadRequestError('the count of elements should be greater than 0'); // 25 is max for no-subscriber scopus
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
    if (orderBy !== "date" && orderBy !== "title") {
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

    //if year is defined
    if (year && year !== "all") {
        //convert to integer
        year = Number(year);
        //if it isn't a valid integer
        if (!Number.isInteger(year)) {
            throw errHandler.createBadRequestError('year has a not valid value!');
        }
    }
    else {
        year = "";
    }


    return year;
}

/**
 * check the validation of max confidence value (it should be a float number between 0 and 1)
 * convert the value from string type to number type
 */
function setAndCheckValidMaxConfidenceValue(value) {


    //if it is not empty
    if (value) {

        //convert it to number type
        value = Number(value);

        //if isn't a number
        if (isNaN(value)) {
            throw errHandler.createBadRequestError('the max confidence value is not a valid number!');
        }

        //if isn't between 0 and 1
        if (value > 1 || value < 0) {
            throw errHandler.createBadRequestError('the max confidence value should be between 0 and 1!');
        }

    }
    else {
        value = 1;
    }


    return value;


}

/**
 * check the validation of min confidence value (it should be a float number between 0 and 1)
 * convert the value from string type to number type
 */
function setAndCheckValidMinConfidenceValue(value) {


    //if it is not empty
    if (value) {

        //convert it to number type
        value = Number(value);

        //if isn't a number
        if (isNaN(value)) {
            throw errHandler.createBadRequestError('the min confidence value is not a valid number!');
        }


        //if isn't between 0 and 1
        if (value > 1 || value < 0) {
            throw errHandler.createBadRequestError('the min confidence value should be between 0 and 1!');
        }

    }
    else {
        value = 0;
    }


    return value;

}

/**
 * check the validation of threshold value (it should be a float number between 0 and 1)
 * convert the value from string type to float number
 */
function setAndCheckValidThresholdValue(value) {


    //if it is not empty
    if (!value) {
        throw errHandler.createBadRequestError('the threshold value is not defined!');
    }

    //convert it to number type
    value = Number(value);

    //if isn't a number
    if (isNaN(value)) {
        throw errHandler.createBadRequestError('the threshold value is not a valid number!');
    }


    //if isn't between 0 and 1
    if (value > 1 || value < 0) {
        throw errHandler.createBadRequestError('the threshold value should be between 0 and 1!');
    }


    return value;

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
 * @param {boolean} isEmptyValid flag for allowing empty arrays
 */
function isValidArray(array, isEmptyValid = false) {

    //if it isn't a array
    if (Array.isArray(array) === false) {
        throw errHandler.createBadRequestError('the parameter isn\'t a array!');
    }
    //if it is empty
    if (array.length === 0 && !isEmptyValid) {
        throw errHandler.createBadRequestError('the array is empty!');
    }


}

/**
 * check the validation of integer array
 * @param {Array[]}array
 */
function isValidArrayInteger(array) {

    //if it isn't a array
    if (Array.isArray(array) === false) {
        throw errHandler.createBadRequestError('the parameter isn\'t a array!');
    }
    //if it is empty
    if (array.length === 0) {
        throw errHandler.createBadRequestError('the array is empty!');
    }

    //check each element
    for (let i = 0; i < array.length; i++) {
        //if it isn't a integer
        if (!Number.isInteger(Number(array[i]))) {
            throw errHandler.createBadRequestError('the array contains not integer element!');
        }
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
        throw errHandler.createNotFoundError("ProjectPaper does not exist!");
    }

}

/**
 * check if the filter is empty
 * @param {Object} filter
 */
function isValidFilter(filter) {

    //if it is empty
    if (!filter) {
        throw errHandler.createNotFoundError("Filter does not exist!");
    }

}

/**
 * check if the email is a valid google email
 * @param {string} email
 */
function isValidGoogleEmail(email) {

    //if it is empty
    if (!email) {
        throw errHandler.createBadRequestError("the email is empty!");
    }
    if (email.toLowerCase().indexOf("@gmail.com") === -1 && email.toLowerCase().indexOf("@studenti.unitn.it") === -1) {
        throw errHandler.createBadRequestError("the email isn't a valid google email!");
    }

}

/**
 * check if the id is a valid integer
 * @param {string} email
 */
function isValidCollaboratorId(id) {

    //error check
    if (id === undefined || id === null) {
        throw errHandler.createBadRequestError("the collaborator's id is empty!");
    }
    //cast id to integer type
    id = Number(id);
    //error check
    if (!Number.isInteger(id)) {
        throw errHandler.createBadRequestError('the collaborator\'s id is not a integer!');
    }


}

/**
 * check if the id is a valid integer
 * @param {string} email
 */
function isValidScreenersId(id) {

    //error check
    if (id === undefined || id === null) {
        throw errHandler.createBadRequestError("the screeners's id is empty!");
    }
    //cast id to integer type
    id = Number(id);
    //error check
    if (!Number.isInteger(id)) {
        throw errHandler.createBadRequestError("the screeners's id is not a integer!");
    }


}


module.exports = {
    setAndCheckValidPaperId,
    setAndCheckValidProjectId,
    setAndCheckValidProjectOrderBy,
    setAndCheckValidProjectPaperId,
    setAndCheckValidFilterId,
    setAndCheckValidProjectPaperOrderBy,
    setAndCheckValidSort,
    setAndCheckValidStart,
    setAndCheckValidCount,
    setAndCheckValidOrderByForScopus,
    setAndCheckValidSearchByForScopus,
    setAndCheckValidYearForScopus,
    setAndCheckValidMaxConfidenceValue,
    setAndCheckValidMinConfidenceValue,
    setAndCheckValidThresholdValue,
    isValidKeyword,
    isValidArray,
    isValidArrayInteger,
    isValidTokenId,
    isValidGoogleId,
    isValidProjectOwner,
    isValidProjectPaper,
    isValidFilter,
    isValidGoogleEmail,
    isValidCollaboratorId,
    isValidScreenersId,


};