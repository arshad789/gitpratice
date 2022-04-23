/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const findDocByValue = require('../outbound/internal_microservice/find_document_by_value');


async function valFieldDataUniqueness(reqTrackingID, parameters) {
    const response = {};
    try {
        clogger.debug(reqTrackingID, ['parameters received in val field data uniqueness function is : ', parameters]);
        // Destructure the parameters
        const {
            collectionName,
            uniqueFields,
            document,
            isNewDoc,
            uniqueFieldsLabel,
            callBackValueContext,
        } = parameters;

        // This will store end user specific messages for all unique field violations
        let userMessage = '';
        // This we will use in error message
        const uniqueFieldsWithValue = _.pick(document, uniqueFields);

        for (let i = 0; i < uniqueFields.length; i += 1) {
            // building fieldSeq to be inline with query format
            const fieldSeq = `document.${uniqueFields[i]}`;
            // Received document contains the value
            const fieldValue = document[uniqueFields[i]];
            const value = {};
            value[fieldSeq] = fieldValue;
            clogger.debug(reqTrackingID, ['Finding any doc exist having value : ', value, 'in collection', collectionName]);

            // Define the payload
            const findDocByValueParams = {
                payload: {
                    collectionName,
                    value,
                    isNewDoc,
                },
                callBackValueContext,
            };
            // If it isn't a new doc then sif is required
            if (!isNewDoc) {
            // This is to omit matching the own field value
                findDocByValueParams.payload.sif = parameters.sif;
            }
            const result = await findDocByValue(reqTrackingID, findDocByValueParams);

            clogger.debug(reqTrackingID, ['find doc by value func result is: ', result]);
            // If value exist
            if (result.valueExist) {
                // Make note that at least one violation found
                response.error = true;
                clogger.debug(reqTrackingID, ['Field data uniqueness FAILED for value:', value, 'Matched document is:', result]);
                const fieldLabel = uniqueFieldsLabel[`${uniqueFields[i]}`];
                userMessage += `${fieldLabel}: '${fieldValue}' already exist. `;
            }
        }
        // This means unique field violation found
        if (response.error) {
            const customError = new Error(userMessage);
            throw (buildErrorObject(400, 'EIMS1036', userMessage, customError.message, 'database', uniqueFieldsWithValue, customError.stack));
        } else {
            // None of the value exist, which means data is unique across all fields
            response.error = false;
            return response;
        }
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in val field data uniuqness function catch is : ', error]);
        response.error = error;
        return response;
    }
}
module.exports = valFieldDataUniqueness;
