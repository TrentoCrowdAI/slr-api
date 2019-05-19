const fetch = require("node-fetch");
const AbortController = require("abort-controller");
const Headers = require('fetch-headers');
const fs= require('fs');

/*this is the file to create fetch request*/


//10seconds for timeout
const timeOutTime = 10 * 1000;

//object to export
const http = {
    get,
    post,
    postPdf
};


/**
 * create a basic fetch request
 * @param url
 * @param options request config
 * @param {int} timeOutTime
 * @return {object} response data
 */
async function request(url, options, timeOutTime) {
    try {
        //console.log("================================\n"+url);

        //create a new abortController for this request
        let abortController = new AbortController();
        let signal = abortController.signal;

        let requestOptions = Object.assign(
            {
                //enable the  sending of cookie
                credentials: 'include',
                "mode": 'cors',
                "signal": signal
            },
            options
        );

        //set timeout clock
        let timer = setTimeout(() => abortController.abort() , timeOutTime);

        let response = await fetch(url, requestOptions);

        //clear timeout clock
        clearTimeout(timer);

        //parse response data
        let data = await parseResponseData(response);
        //response error check
        checkResponseStatus(response,data);
        return  data;

    }
    catch (error) {
       // console.dir(error.message);

        return error;

    }
}

/**
 * get method
 * @param url
 * @param queryData query string
 * @return {object} response data
 */
async function get(url, queryData = "") {
    let query = "";
    if (queryData !== "") {
        query = "?";
        for (let key in queryData) {
            query += key + "=" + encodeURIComponent(queryData[key]).replace(/\(/g, "%28").replace(/\)/g, "%29") + "&";
        }
        //delete the last &
        query = query.slice(0, query.length - 1);
    }

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');

    let options = {
        "method": 'GET',
        "headers": jsonHeaders,
    };

    return await request(url + query, options, timeOutTime);
}



/**
 * post method
 * @param url
 * @param bodyData
 * @return {object } response data
 */
async function post(url, bodyData = "") {

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    let body = JSON.stringify(bodyData, null, 2);
    let options = {
        "method": 'POST',
        "headers": jsonHeaders,
        "encoding": null,
        "body": body,
    };

    return await request(url, options, timeOutTime);
}


/**
 * post pdf method
 * @param url
 * @param fsStream read stream of file
 * @return {object} response data
 */
async function postPdf(url, fsStream) {

    //custom timeout for request
    let customTimeOutTime= 60 * 1000;

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json, text/plain, */*');
    //jsonHeaders.append('Cache-Control', 'no-cache');
    jsonHeaders.append('Content-Type', 'application/pdf');
    let options = {
        "method": 'POST',
        "headers": jsonHeaders,
        "encoding": null,
        //"body": bodyData
        "body": fsStream,
    };

    return await request(url, options, customTimeOutTime);
}



/**
 *  * check response status
 * @param response to check
 * @param data data received
 * @throws {Error} if  status code < 200 or status code >= 300
 */
function checkResponseStatus(response, data) {

    if (response.status < 200 || response.status >= 300) {
        let error = new Error(response.statusText);
        error.data = response;

        //if is the scoupus error
        if(data["service-error"]){
            let scopusErrorStatus = data["service-error"].status;
            error.message = scopusErrorStatus.statusCode+" : "+scopusErrorStatus.statusText;
        }
        throw error;
    }

}


/**
 * parse the response of  http request
 * @param response response object
 * @return {object} data parsed
 */
async function parseResponseData(response) {
    //get response data type
    const contentType = response.headers.get('Content-Type');
    let data = null;
    //parse the data by its type
    if (contentType != null) {
        if (contentType.indexOf('text') > -1) {
            data = await response.text()
        }
        if (contentType.indexOf('video') > -1) {
            data = await response.blob();
        }
        if (contentType.indexOf('json') > -1) {
            data = await response.json();
        }
    }
    else if (response != null) {
        data = await response.text();
    }
    return data;
}


module.exports = http;