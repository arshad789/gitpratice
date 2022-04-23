// const mongoose = require('mongoose');
// const _ = require('lodash');
// const dynDocumentModel = require('../mongoose/models/dynamic_document_model');
// const dynDocSchma = require('../Joi/schema/dynamic_document_schema');
// const clogger = require('../../../log_modules/generic/custom_logger');
// const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');

// const buildErrorObject = require('../../../error_handler/generic/build_error_object');


// async function getDynamicDoc(p) {
//     const response = {};
//     try {
//         // Validate the parameters (p) is in good shape
//         clogger.debug(p.reqTrackingID, ['Validating parameter received in get dynamic doc func : ', p.payload]);
//         const joiDocSchmaReslt = hapiJoiValidate(p.payload, dynDocSchma.getDynDocSchma);
//         clogger.info(p.reqTrackingID, ['Joi schema validation result for get dynamic doc payload is : ', joiDocSchmaReslt]);

//         if (joiDocSchmaReslt.error) {
//             clogger.info(p.reqTrackingID, ['Invalid payload received. Error Object is: ', joiDocSchmaReslt.error]);
//             throw (buildErrorObject(400, 'EIMS1039', 'EIMSG0001', joiDocSchmaReslt.error.message, 'payload', p.payload, joiDocSchmaReslt.error.stack));
//         }
//         clogger.debug(p.reqTrackingID, ['creating mongoose model class for collection: ', p.payload.ref]);

//         const DynamicDocument = mongoose.model(p.payload.ref, dynDocumentModel, p.payload.ref);
//         response.payload = await DynamicDocument.findById(p.payload._id);
//         clogger.debug(p.reqTrackingID, ['Doc retrived is : ', response.payload]);
//         return (response);
//     } catch (error) {
//         clogger.debug(p.reqTrackingID, ['Error object in get dynamic document function catch is : ', error]);
//         response.error = error;
//         return (response);
//     }
// }

// module.exports = getDynamicDoc;
