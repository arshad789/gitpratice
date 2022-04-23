// Load required modules
const _ = require('lodash');
const isValid = require('date-fns/isValid');
const parseISO = require('date-fns/parseISO');
const clogger = require('../../../log_modules/generic/custom_logger');

// It validates the date value

function valDate(reqTrackingID, field) {
    clogger.debug(reqTrackingID, ['Date field received in val date function is : ', field]);
    const result = { error: false };
    let message = '';

    // If min date is defined
    if (!_.isNil(field.min)) {
        // If min date is invalid
        if (!isValid(parseISO(field.min))) {
            message += "'min' must be a valid date. ";
            result.error = new Error(message);
        }
    }
    // If min date is defined
    if (!_.isNil(field.max)) {
        // If min date is invalid
        if (!isValid(parseISO(field.max))) {
            message += "'max' must be a valid date";
            result.error = new Error(message);
        }
    }
    return result;
}
module.exports = valDate;
