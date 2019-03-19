//HTTP-friendly error objects
const Boom = require('boom');

//object that contains all the error names
const errorNames = {
    badRequest : "badRequest",
    notFound : "notFound"
     //to add the other error names
    
};

/**
 * Creates and returns a error object with error.name "bad request". 
 * @param {String} msg error message
 * @returns {Error} object error
 */
const createBadRequestError = msg => {
    let e = new Error(msg);
    e.name = errorNames.badRequest;
    return e;
};

/**
 * Creates and returns a error object with error.name "not found". 
 * @param {String} msg error message
 * @returns {Error} object error
 */
const createNotFoundError = msg => {
    let e = new Error(msg);
    e.name = errorNames.notFound;
    return e;
};



/**
 * Creates an boom error object that the service layer returns. It uses the boom library.
 *
 * @param {Error} e An error object. The property name should be set
 * to correctly perform the mapping from error to HTTP status code.
 */
const createBoomErrorForService = e => {
    
    //default errorBoom
    var errorBoom =Boom.badImplementation();
    
    if (e.name === errorNames.badRequest)
    {
        errorBoom = Boom.badRequest(e.message);
    }
   else if (e.name === errorNames.notFound)
    {
        errorBoom = Boom.notFound(e.message);
    }
    //when the error isn't threw by delegate level
    else if(e.status === 401){
        const message = 'Not authorized to perform the request';
        errorBoom = Boom.unauthorized(message);
    }
    
    //to add the other cases of error
    

    
    return errorBoom;
};

module.exports = {
    createBadRequestError,
    createNotFoundError,
    createBoomErrorForService
};
