// Import required modules
const express = require('express');
const clogger = require('../../../log_modules/generic/custom_logger');
const errorHandler = require('../../../error_handler/generic/error_handler');
const createSequence = require('../generic_functions/create_sequence');


const router = express.Router();

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
    const { reqTrackingID } = res.locals;
    let response = {};
    try {
        clogger.debug(reqTrackingID, ['Creating new sequence for: ', req.body]);
        response = await createSequence(reqTrackingID, req.body);

        clogger.debug(reqTrackingID, ['Response received after calling create sequence funtion : ', response]);

        if (response.error) {
            throw response.error;
        } else {
            clogger.logResponsePaylod(reqTrackingID, 200, response.payload);
            res.status(200).send(response.payload);
        }
    } catch (error) {
        // Sending the error to error handler
        response = errorHandler(reqTrackingID, 'EIMS1057', error);

        // Log response payload
        clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

        // Send the error response
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
