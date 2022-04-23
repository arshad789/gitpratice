const logger = require('../winston/winston_logger');

function logResponsePaylod(reqTrackingID, statusCode, payload) {
    // add unique id
    logger.debug('Inbound Response Sent:\nRequest Tracking ID: %o\nResponse status code: %o\nPayload: %o', reqTrackingID, statusCode, payload);
}

function debug(reqTrackingID, message) {
    logger.debug('[%o]: %o', reqTrackingID, message);
}

function info(reqTrackingID, message) {
    logger.info('[%o]: %o', reqTrackingID, message);
}

module.exports = { logResponsePaylod, debug, info };
