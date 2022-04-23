// Import required modules
const express = require('express');
const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');
const errorHandler = require('../../../error_handler/generic/error_handler');
const getNextSequence = require('../generic_functions/get_next_sequence');


const router = express.Router();

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
    const reqTrackingID = !_.isNil(req.body.reqTrackingID) ? req.body.reqTrackingID
        : res.locals.reqTrackingID;
    let response = {};
    try {
        clogger.debug(reqTrackingID, ['Payload received in get next sequence route is: ', req.body]);
        response = await getNextSequence(reqTrackingID, req.body);

        clogger.debug(reqTrackingID, ['Response received after calling create sequence funtion : ', response]);

        if (response.error) {
            throw response.error;
        } else {
            const nextSeq = {
                seq: response,
            };
            clogger.logResponsePaylod(reqTrackingID, 200, nextSeq);
            res.status(200).send(nextSeq);
        }
    } catch (error) {
        // Sending the error to error handler
        response = errorHandler(reqTrackingID, 'EIMS1067', error);

        // Log response payload
        clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

        // Send the error response
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
