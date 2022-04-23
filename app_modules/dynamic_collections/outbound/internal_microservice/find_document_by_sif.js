const intMicroSrvcReq = require('../../../../generic_modules/got/internal/microservices_request');
const clogger = require('../../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../../error_handler/generic/build_error_object');


async function findDocBySIF(reqTrackingID, payload) {
    try {
        const { callBackSIFContext } = payload;
        clogger.debug(reqTrackingID, ['Parameters received in find doc by sif function is : ', payload]);
        const findDocBySIFRes = await intMicroSrvcReq.post(
            callBackSIFContext,
            { json: payload },
        ).json();
        clogger.debug(reqTrackingID, ['Response received is : ', findDocBySIFRes]);

        return (findDocBySIFRes);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in find doc by id function catch is : ', error]);
        if (error.statusCode === 404 && error.body.code !== 'EIMS0404') {
            const customError = new Error(error.body.details.message);
            throw (buildErrorObject(404, 'EIMS1065', 'EIMSG0004', customError.message, 'outbound', payload, customError.stack));
        }
        // If error has a response body, then use its message, but throw as 500
        if (error.statusCode >= 400 && error.statusCode < 500) {
            const customError = new Error(error.body.details.message);
            throw (buildErrorObject(500, 'EIMS1064', 'EIMSG0005', customError.message, 'outbound', error.body.details.location, customError.stack));
            // If error doesn't have a response body, throw as it is
        } else {
            // throw error as it is, it will be 500 internal server error
            throw error;
        }
    }
}

module.exports = findDocBySIF;
