// // Import required modules
// const express = require('express');
// const DynamicCollection = require('../mongoose/models/dynamic_collection_model');
// const clogger = require('../../../log_modules/generic/custom_logger');
// const errorHandler = require('../../../error_handler/generic/error_handler');
// // const buildErrorObject = require('../../../error_handler/generic/build_error_object');

// const router = express.Router();

// router.get('/:name?', async (req, res) => {
//     const { reqTrackingID } = res.locals;
//     try {
//         // If name is defined, then get the fileds which are dynamic in nature

//         // If name is not defined, then get all collection names
//         clogger.info(reqTrackingID, 'getting data from database...');
//         const result = await DynamicCollection
//             .find()
//             .sort({ name: 1 })
//             .select({ name: 2 });
//         res.send(result);
//     } catch (error) {
//         // Sending the error to error handler
//         const response = errorHandler(reqTrackingID, 'EIMS1005', error);

//         // Log response payload
//         clogger.logResponsePaylod(reqTrackingID, response.statusCode, response);

//         // Send the error response
//         res.status(response.statusCode).json(response);
//     }
// });

// module.exports = router;
