/* eslint-disable max-len */
const userMessageDecode = require('../../error_handler/generic/user_message_decode');

// This function takes differnt values and build a standard error object
function buildErrorObject(statusCode, code, message, detailMessage, locationType, location, errorStack) {
    let errorName;
    if (statusCode === 400) {
        errorName = 'ValidationError';
    } else if (statusCode === 401) {
        errorName = 'AuthenticationError';
    } else if (statusCode === 403) {
        errorName = 'AuthorizationError';
    } else if (statusCode === 404) {
        errorName = 'NotFound';
    } else if (statusCode === 405) {
        errorName = 'MethodNotAllowed';
    } else if (statusCode === 500) {
        errorName = 'InternalServerError';
    } else {
        errorName = 'UnknownError';
    }

    const responsePayload = {};

    // Response status code
    responsePayload.statusCode = statusCode;
    // Error name
    responsePayload.name = errorName;


    // Custom code to distinguish between each error
    responsePayload.code = code;

    // Friendly message for the end user
    responsePayload.message = userMessageDecode(message);

    // Details of the error for front end developer
    responsePayload.details = {
        // Descriptive location to distinguish place of error
        locationType,
        location,
        message: detailMessage,

    };

    const error = {
        stack: errorStack,
        response: responsePayload,
    };

    // Return error object which contains response payload and stack trace
    return (error);
}


module.exports = buildErrorObject;
