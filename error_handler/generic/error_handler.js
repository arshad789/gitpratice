const _ = require('lodash');
const clogger = require('../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../error_handler/generic/build_error_object');

function errorHandler(reqTrackingID, code, error) {
    // Log error object which will have response payload and stack trace
    clogger.debug(reqTrackingID, ['Error object received in error handler func is : ', error]);
    if (!_.isNil(error.response) && !_.isNil(error.response.statusCode)) {
        clogger.debug(reqTrackingID, ['status code is not null: ', error.response.statusCode]);
        if (error.response.statusCode >= 400 || error.response.statusCode < 500) {
            // return the error response
            return (error.response);
        }
    }

    // Build error object
    const ISError = buildErrorObject(500, code, error.message, null, null, error.stack);

    // Log error object which will have response payload and stack trace
    clogger.debug(reqTrackingID, ['Internal server error object is : ', ISError]);

    // return the error response
    return (ISError.response);
}

module.exports = errorHandler;
