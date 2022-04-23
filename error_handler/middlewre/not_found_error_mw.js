/* eslint-disable no-unused-vars */
const clogger = require('../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../error_handler/generic/build_error_object');
const errorHandler = require('../../error_handler/generic/error_handler');


// 404 Error middleware to handle requests for which resource is not found
// eslint-disable-next-line no-unused-vars

module.exports = function notFoundErrorMW(req, res, next) {
    const error = new Error(`No such operation exist: ${req.url}`);
    // keep the code EIMS0404 as it is as its being used in code
    const cerror = buildErrorObject(404, 'EIMS0404', 'Operation Not Found', error.message, 'api', req.url, error.stack);
    // Sending the custom error to error handler
    const response = errorHandler(res.locals.reqTrackingID, 'EIMS1028', cerror);

    // Log response payload
    clogger.logResponsePaylod(res.locals.reqTrackingID, response.statusCode, response);

    res.status(response.statusCode).json(response);
};
