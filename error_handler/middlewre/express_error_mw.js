const clogger = require('../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../error_handler/generic/build_error_object');
const errorHandler = require('../../error_handler/generic/error_handler');


// Error middleware to handle any internal server error in express module
// eslint-disable-next-line no-unused-vars
module.exports = function expressErrorMW(error, req, res, next) {
    clogger.debug('URL', req.originalUrl);
    clogger.debug(res.locals.reqTrackingID, ['Error object received in express error mw is : ', error]);
    const cerror = buildErrorObject(error.statusCode, 'EIMS1027', 'Invalid JSON payload', error.message, 'payload', error.body, error.stack);
    // Sending the custom error to error handler
    const response = errorHandler(res.locals.reqTrackingID, 'EIMS1028', cerror);

    // Log response payload
    clogger.logResponsePaylod(res.locals.reqTrackingID, response.statusCode, response);

    // Send the error response
    res.status(response.statusCode).json(response);
};
