// // Import required modules
// const express = require('express');
// const errorHandler = require('../../../error_handler/generic/error_handler');
// const clogger = require('../../../log_modules/generic/custom_logger');
// const getDynamicDoc = require('../generic_functions/get_dynamic_doc');

// const router = express.Router();
// // It will add a UPDATE the existing dynamic filed in an existing collection
// router.get('/:field?', async (req, res) => {
//     // Capture the request tracking id, which we'll use through out the implementation for tracking
//     const { reqTrackingID } = res.locals;

//     try {
//         res.send(req.params);
//         return;
//         const params = {
//             reqTrackingID,
//             payload: req.body,
//         };
//         clogger.debug(reqTrackingID, ['Calling get dynamic func with parameters: ', params]);
//         const result = await getDynamicDoc(params);
//         clogger.debug(reqTrackingID, ['Response received after calling function is : ', result]);
//         if (result.error) {
//             throw result.error;
//         } else {
//             clogger.logResponsePaylod(reqTrackingID, 200, result.payload);
//             res.status(200).send(result.payload);
//         }
//     } catch (error) {
//         // Sending the error to error handler
//         const response = errorHandler(reqTrackingID, 'EIMS1018', error);

//         // Log response payload
//         clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

//         // Send the error response
//         res.status(response.statusCode).json(response);
//     }
// });

// module.exports = router;
