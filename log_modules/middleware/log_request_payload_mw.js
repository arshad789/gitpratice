const uuidv1 = require('uuid/v1');
const clogger = require('../generic/custom_logger');


function logRequestPyaloadMW(req, res, next) {
    // Log the unique request id once decided where to capture from
    // capture the Request-Tracking-Id header

    let reqTrackingID = req.get('Request-Tracking-Id');
    // If Request-Tracking-Id is not set, then set it
    if (!reqTrackingID) {
        reqTrackingID = uuidv1();
    }
    res.locals.reqTrackingID = reqTrackingID;

    clogger.debug(reqTrackingID, ['Inbound Request Received', 'Method: ', req.method, 'URL: ', req.originalUrl, 'Payload: ', req.body]);

    next();
}

module.exports = logRequestPyaloadMW;
