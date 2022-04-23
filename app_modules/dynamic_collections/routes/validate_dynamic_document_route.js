// Import required modules
const express = require('express');
const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');
const errorHandler = require('../../../error_handler/generic/error_handler');
const validateDynamicDoc = require('../generic_functions/validate_dynamic_document');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');


const router = express.Router();

// eslint-disable-next-line consistent-return
router.all('/', async (req, res) => {
    const reqTrackingID = !_.isNil(req.body.reqTrackingID) ? req.body.reqTrackingID
        : res.locals.reqTrackingID;
    let response = {};
    try {
        // varaible hold the value wether a new doc is being added or existing one being updated
        let isNewDoc;
        if (req.method === 'POST') {
            isNewDoc = true;
        } else if (req.method === 'PUT') {
            isNewDoc = false;
        } else {
            clogger.debug(reqTrackingID, ['Received invalid method in add validate dynamic document route...']);
            const invalidMethodError = new Error(`Method '${req.method}' not allowed`);
            throw (buildErrorObject(405, 'EIMS1069', 'EIMSG0405', invalidMethodError.message, 'method', req.method, invalidMethodError.stack));
        }
        clogger.debug(reqTrackingID, ['Validating dynamic document: ', req.body]);
        const parameters = {
            dynamicDocPayload: req.body,
            isNewDoc,
        };
        response = await validateDynamicDoc(reqTrackingID, parameters);

        clogger.debug(reqTrackingID, ['Response received after calling validate dynamic doc funtion : ', response]);

        if (response.error) {
            throw response.error;
        } else {
            clogger.logResponsePaylod(reqTrackingID, 200, response.payload);
            res.status(200).send(response.payload);
        }
    } catch (error) {
        // Sending the error to error handler
        response = errorHandler(reqTrackingID, 'EIMS1032', error);

        // Log response payload
        clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

        // Send the error response
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
