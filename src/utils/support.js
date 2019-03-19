


/**
 * check if they are valid list parameters 
 * @param {integer} number number of papers
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {string} error message. if isn't error will return empty string 
 */
function areValidListParameters(number, offset, orderBy, sort) {
    let errorMessage = "";
    if (number === undefined || offset === undefined || orderBy === undefined || sort === undefined || number === null || offset === null || orderBy === null || sort === null)
    {
        errorMessage = "the paramters are not defined!";
    }
    else if (!Number.isInteger(number) || !Number.isInteger(offset))
    {
        errorMessage = "the number or offset is not a integer!";
    }
    else if (!(orderBy === "id" || orderBy === "date_created" || orderBy === "date_last_modified" || orderBy === "date_deleted"))
    {
        errorMessage = "the orderBy is not valid!";
    }
    else if (!(sort === "ASC" || sort === "DESC"))
    {
        errorMessage = "the sort is not valid!";
    }
    return errorMessage;
}
























module.exports.areValidListParameters = areValidListParameters;