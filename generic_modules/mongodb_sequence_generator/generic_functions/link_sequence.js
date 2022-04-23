// const joiValidate = require('../../../Joi/hapi_joiValidate');
// const SequenceCollection = require('../mongoose/models/sequence_model');
// const buildErrorObject = require('../../../error_handler/generic/build_error_object');
// const clogger = require('../../../log_modules/generic/custom_logger');
// const linkSeqSchema = require('../Joi/schema/link_sequence_schema');


// async function linkSequence(reqTrackingID, seqIds) {
//     const response = {};
//     try {
//         clogger.debug(reqTrackingID, ['Validating link sequence paylod', seqIds]);
//         const joiSeqPayloadReslt = joiValidate({ _id: seqIds }, linkSeqSchema);

//         if (joiSeqPayloadReslt.error) {
//             clogger.info(reqTrackingID, ['Invalid payload received. Error Object is: ', joiSeqPayloadReslt.error]);
//             throw (buildErrorObject(400, 'EIMS1058', 'EIMSG0001', joiSeqPayloadReslt.error.message, 'payload', seqIds, joiSeqPayloadReslt.error.stack));
//         }

//         clogger.debug(reqTrackingID, ['Processing sequence: ', seqIds]);
//         const result = await SequenceCollection.updateMany(
//             // match with the given sequence name where link is in false state
//             { _id: seqIds, link: false },
//             // Update link to true
//             { link: true },
//             // new true will return updated doc & upsert false will not insert new doc
//             { new: true, upsert: false },
//         );
//         clogger.debug(reqTrackingID, ['Result after updating sequence id(s): ', seqIds, 'is: ', result]);
//         if (result.nModified !== seqIds.length) {
//             const customError = new Error(`Failed to link to sequence(s): ${seqIds}`);
//             throw (buildErrorObject(400, 'EIMS1060', customError.message, customError.message, 'database', seqIds, customError.stack));
//         }

//         response.error = false;
//         return response;
//     } catch (error) {
//         clogger.debug(reqTrackingID, ['Error object in link sequence function catch is : ', error]);
//         response.error = error;
//         return response;
//     }
// }
// module.exports = linkSequence;
