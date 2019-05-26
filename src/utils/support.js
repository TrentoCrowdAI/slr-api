const errHandler = require(__base + 'utils/errors');
//the config file
const config = require(__base + 'config');
//the format of valid input
const validationSchemes = require(__base + 'utils/validation.schemes');

/**
 * transform a array to string
 * @param arraySource source array
 * @param separator  between element
 * @param surroundedBy symbols that surround the element
 * @return {string} toString of array
 */
function arrayToString(arraySource, separator, surroundedBy) {

    let output = "";
    for (let i = 0; i < arraySource.length; i++) {
        output += surroundedBy + arraySource[i] + surroundedBy;
        //if isn't last element, add a comma ad end of string
        if (i < arraySource.length - 1) {
            output += separator;
        }
    }

    return output;

}

/**
 * difference operation of two arrays A - B
 * @param {array[]} arrayA
 * @param {array[]} arrayB
 * @return {array[]} result of difference
 */
function differenceOperation(arrayA, arrayB) {

    //return true if not exist, false if exist
    function checkExistenceOfElement(element) {
        return !arrayB.includes(element);
    }

    //create a new array where includes only the element that isn't present in arrayB
    let newArray = arrayA.filter(checkExistenceOfElement);
    return newArray;
}


/**
 * remove paper object from array by a array of eids
 * @param arrayA array papers
 * @param arrayB array eids
 * @return {array[]} new array papers
 */
function removeElementFromArrayByEids(arrayA, arrayB) {

    //return true if not exist, false if exist
    function checkExistenceOfElement(element) {
        return !arrayB.includes(element.eid);
    }

    //create a new array where includes only the element that isn't present in arrayB
    let newArray = arrayA.filter(checkExistenceOfElement);
    return newArray;

}


module.exports = {
    arrayToString,
    differenceOperation,
    removeElementFromArrayByEids,

};