/* eslint-disable no-loop-func */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
// Import required modules
// const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const dynDocSchma = require('../Joi/schema/validate_dynamic_document_schema');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');
const buildJoiSchema = require('./build_joi_schema');
const valFieldDataUniqueness = require('./val_field_data_uniqueness');
const getDynamicCollecSchema = require('./get_dynamic_collection_schema');
const enrichSeqFields = require('./enrich_seq_fields');
const valPhoneNumber = require('./val_phone_number');


async function validateDynamicDocument(reqTrackingID, parameters) {
    const response = {};
    try {
        const {
            dynamicDocPayload,
            isNewDoc,
        } = parameters;

        clogger.debug(reqTrackingID, ['Parameters received in validate dynamic document function is: ', parameters]);

        clogger.info(reqTrackingID, ['Validating dynamic document payload', dynamicDocPayload]);
        let schema;
        if (isNewDoc) {
            clogger.debug(reqTrackingID, ['Assigning add new dynamic doc schema']);
            schema = dynDocSchma.addDynDocSchma;
        } else {
            clogger.debug(reqTrackingID, ['Assigning update dynamic doc schema']);
            schema = dynDocSchma.updateDynDocSchma;
        }

        // This validation only insures that the payload is in correct format.
        // Data validation will happen later
        const joiDocSchmaReslt = hapiJoiValidate(dynamicDocPayload, schema);
        clogger.debug(reqTrackingID, ['Joi schema validation result is: ', joiDocSchmaReslt]);

        if (joiDocSchmaReslt.error) {
            clogger.info(reqTrackingID, ['Invalid payload received. Error Object is: ', joiDocSchmaReslt.error]);
            throw (buildErrorObject(400, 'EIMS1033', 'EIMSG0001', joiDocSchmaReslt.error.message, 'payload', dynamicDocPayload, joiDocSchmaReslt.error.stack));
        }
        // Deconstruct payload
        const {
            collectionName,
            existingDoc,
            callBackValueContext,
            document,
        } = dynamicDocPayload;


        clogger.debug(reqTrackingID, ['Getting schema details from dynamic collections for : ', collectionName]);

        // Find one will return only one object or null
        const dynamicCollecSchema = await getDynamicCollecSchema(reqTrackingID, collectionName);
        clogger.info(reqTrackingID, ['Dynamic collection schema retrived from dynamic collections collection is : ', dynamicCollecSchema]);

        // Calling build joi schma for this collection
        const {
            joiSchema, uniqueFields, uniqueFieldsLabel, seqFields, phoneFields,
        } = buildJoiSchema(reqTrackingID, dynamicCollecSchema);

        // Build hapi joi schema
        const hapiJoiSchema = Joi.object().append(joiSchema);

        const result = hapiJoiValidate(document, hapiJoiSchema);
        clogger.debug(reqTrackingID, ['Joi validation result is : ', result]);

        // If the validated dynamic field errored
        if (result.error) {
            clogger.debug(reqTrackingID, ['Joi validation failed for dynamic field data: ', result.error]);
            throw (buildErrorObject(400, 'EIMS1035', result.error.message, result.error.message, 'payload', dynamicDocPayload, result.error.stack));
        }

        clogger.debug(reqTrackingID, ['Unique plain fields are: ', uniqueFields]);
        clogger.debug(reqTrackingID, ['Unique plain fields labels are: ', uniqueFieldsLabel]);
        clogger.debug(reqTrackingID, ['Sequence fields are : ', seqFields]);
        clogger.debug(reqTrackingID, ['Phone fields are : ', phoneFields]);


        // Validate the phone number
        if (!_.isEmpty(phoneFields)) {
            // Grab the phone number to validate
            const phoneNumbers = _.pick(document, _.keys(phoneFields));
            clogger.debug(reqTrackingID, ['Phone numbers are: ', phoneNumbers]);
            // valPhonenumber return promise, hence await
            const valPhoneNumberResult = await valPhoneNumber(reqTrackingID, phoneFields, phoneNumbers);
            clogger.debug(reqTrackingID, ['Phone number validation result is  : ', valPhoneNumberResult]);
            if (valPhoneNumberResult.error) {
                throw valPhoneNumberResult.error;
            }
        }

        // checking for field uniqueness
        const valFieldDataUniqueParams = {
            collectionName,
            uniqueFields,
            document,
            isNewDoc,
            uniqueFieldsLabel,
            callBackValueContext,
        };
        // We need to pass these extra parameters if we are updating a doc
        if (!isNewDoc) {
            valFieldDataUniqueParams.sif = dynamicDocPayload.sif;
        }
        const valRes = await valFieldDataUniqueness(reqTrackingID, valFieldDataUniqueParams);
        clogger.debug(reqTrackingID, ['Field uniqueness result is : ', valRes]);
        if (valRes.error) {
            throw valRes.error;
        }

        // Generate the sequence if it is a new doc
        // No need to check for uniqueness as we are generating the sequence
        const valDocData = { document };
        if (isNewDoc && !_.isEmpty(seqFields)) {
            // enrich sequence fields
            const enrichResult = await enrichSeqFields(reqTrackingID, seqFields);
            clogger.debug(reqTrackingID, ['Enrich sequence result is : ', enrichResult]);
            clogger.debug(reqTrackingID, ['document before enrichment is : ', document]);
            valDocData.document = _.merge(document, enrichResult);
            clogger.debug(reqTrackingID, ['Valid doc data after sequence enrichment is : ', valDocData.document]);
        }
        // If updating an existing doc
        if (!isNewDoc) {
            clogger.debug(reqTrackingID, ['Old document: ', existingDoc]);
            clogger.debug(reqTrackingID, ['Updated document : ', document]);
            existingDoc.document = _.merge(existingDoc.document, document);
            clogger.debug(reqTrackingID, ['Existing doc after merge with updated doc data is : ', existingDoc.document]);
        }

        // Based on new doc or exising one, save or update
        if (isNewDoc) {
            response.payload = valDocData;
        } else {
            response.payload = existingDoc;
        }
        clogger.debug(reqTrackingID, ['Dynamic document validation result is : ', response.payload]);
        return (response);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in add dynamic document function catch is : ', error]);
        response.error = error;
        return (response);
    }
}

module.exports = validateDynamicDocument;
