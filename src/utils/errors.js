//HTTP-friendly error objects
const Boom = require('boom');

/**
 * Creates and returns 400 error object. 
 * @param {String} msg error message
 * @returns {Error} object error
 */
const create400Error = msg => {
    let e = new Error(msg);
    e.code = 400;
    return e;
};

/**
 * Creates and returns 404 error object. 
 * @param {String} msg error message
 * @returns {Error} object error
 */
const create404Error = msg => {
    let e = new Error(msg);
    e.code = 400;
    return e;
};



/**
 * Creates an error that the service layer returns. It uses the boom library.
 *
 * @param {Error} e An error object. The property name should be set
 * to correctly perform the mapping from error to HTTP status code.
 */
const createServiceError = e => {
    
    //default errorBoom
    var errorBoom =Boom.badImplementation();
    
    if (e.code === 400)
    {
        errorBoom = Boom.badRequest(e.message);
    }
   else if (e.code === 404)
    {
        errorBoom = Boom.notFound(e.message);
    }
    
    //to add the other cases of error
    
    return errorBoom;
};

module.exports = {
    create400Error,
    create404Error,
    createServiceError
};
