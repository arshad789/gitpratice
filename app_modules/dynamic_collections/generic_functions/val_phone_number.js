const _ = require('lodash');
const PhoneNumber = require('awesome-phonenumber');
const clogger = require('../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');


async function valPhoneNumber(reqTrackingID, phoneFields, phoneNumbers) {
    const response = {};
    try {
        clogger.debug(reqTrackingID, ['Phone numbers received in val phone number function is : ', phoneNumbers]);
        _.forOwn(phoneNumbers, (number, fieldSeq) => {
            clogger.debug(reqTrackingID, ['Validating phone number : ', number]);
            const pn = PhoneNumber(number);
            const result = pn.toJSON();
            // If number is not valid, then throw error
            if (!result.valid) {
                // ${phoneFields[fieldSeq]} gives me that field label
                const label = phoneFields[fieldSeq];
                const userMessage = `'${label}': '${number}': Invalid number`;
                const customError = new Error(result.possibility);
                throw (buildErrorObject(400, 'EIMS1062', userMessage, customError.message, 'payload', `'${label}': '${number}'`, customError.stack));
            }
        });
        response.error = false;
        return response;
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in val phone number function catch is : ', error]);
        response.error = error;
        return response;
    }
}
module.exports = valPhoneNumber;
