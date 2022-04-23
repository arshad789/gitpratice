/* eslint-disable max-len */
// Import required modules
const express = require('express');
const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');
const errorHandler = require('../../../error_handler/generic/error_handler');
const addDynamicCollection = require('../generic_functions/add_dynamic_collection');
const addUpdateDynamicCollecField = require('../generic_functions/add_update_dynamic_collection_field');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');


const router = express.Router();

// eslint-disable-next-line consistent-return
router.all('/:type?', async (req, res, next) => {
    const { reqTrackingID } = res.locals;
    try {
        let newCollec = false;
        let newField = false;
        let updateField = false;

        if (req.method === 'POST') {
            if (req.params.type === 'field') {
                clogger.debug(reqTrackingID, ['Adding field to existing collection', req.body]);
                newField = true;
            } else if (_.isNil(req.params.type)) {
                clogger.debug(reqTrackingID, ['Adding new collection', req.body]);
                newCollec = true;
            } else {
                clogger.debug(reqTrackingID, ['Nothing matched in add dynamic collection route...']);
                // Using return to stop further execution
                return next();
            }
        } else if (req.method === 'PUT') {
            if (req.params.type === 'field') {
                clogger.debug(reqTrackingID, ['Updating field in an existing collection', req.body]);
                updateField = true;
            } else {
                // Using return to stop further execution
                clogger.debug(reqTrackingID, ['Nothing matched in add dynamic collection route...']);
                return next();
            }
        } else {
            clogger.debug(reqTrackingID, ['Received invalid method in add dynamic collection route...']);
            // Using return to stop further execution
            const invalidMethodError = new Error(`Method '${req.method}' not allowed`);
            throw (buildErrorObject(405, 'EIMS1068', 'EIMSG0405', invalidMethodError.message, 'method', req.method, invalidMethodError.stack));
        }
        // To hold the result
        let result;
        // If new collection
        if (newCollec) {
            clogger.debug(reqTrackingID, ['Calling add new dynamic collection']);
            result = await addDynamicCollection(reqTrackingID, req);
            clogger.debug(reqTrackingID, ['Response received after calling add dynamic function is : ', result]);
        // if adding/updating field in collection
        } else {
            clogger.debug(reqTrackingID, ['Calling add new/update dynamic collection field']);
            result = await addUpdateDynamicCollecField(reqTrackingID, req, newField, updateField);
            clogger.debug(reqTrackingID, ['Response received after calling add/update dynamic collection field is : ', result]);
        }

        if (result.error) {
            throw result.error;
        } else {
            clogger.logResponsePaylod(reqTrackingID, 200, result.payload);
            res.status(200).send(result.payload);
        }
    } catch (error) {
        // Sending the error to error handler
        const response = errorHandler(reqTrackingID, 'EIMS1005', error);

        // Log response payload
        clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

        // Send the error response
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
