const intMicroSrvcReq = require('../../../../generic_modules/got/internal/microservices_request');
const clogger = require('../../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../../error_handler/generic/build_error_object');


async function findDocByValue(reqTrackingID, parameters) {
    let result = {};
    try {
        const { callBackValueContext, payload } = parameters;
        clogger.debug(reqTrackingID, ['Parameters received in find doc by value function is : ', parameters]);
        const findDocByValueRes = await intMicroSrvcReq.post(
            callBackValueContext,
            { json: payload },
        ).json();
        clogger.debug(reqTrackingID, ['Response received is : ', findDocByValueRes]);
        // This means value exist
        result = { valueExist: true };
        return (result);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in find doc by value function catch is : ', error]);
        // This means value doesn't exist
        if (error.statusCode === 404 && error.body.code !== 'EIMS0404') {
            result = { valueExist: false };
            return (result);
        }
        // For everything else throw error
        if (error.statusCode >= 400 && error.statusCode < 500) {
            const customError = new Error(error.body.details.message);
            throw (buildErrorObject(500, 'EIMS1066', 'EIMSG0005', customError.message, 'outbound', error.body.details.location, customError.stack));
            // If error doesn't have a response body, throw as it is
        } else {
            // throw error as it is, it will be 500 internal server error
            throw error;
        }
    }
}

module.exports = findDocByValue;
