const _ = require('lodash');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');

const SequenceCollection = require('../mongoose/models/sequence_model');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');
const newSeqSchema = require('../Joi/schema/new_sequence_schema');


async function createSequence(reqTrackingID, newSeqPayload) {
    const response = {};

    try {
        clogger.debug(reqTrackingID, ['Validating sequence paylod', newSeqPayload]);
        const joiSeqPayloadReslt = hapiJoiValidate(newSeqPayload, newSeqSchema);

        if (joiSeqPayloadReslt.error) {
            clogger.info(reqTrackingID, ['Invalid payload received. Error Object is: ', joiSeqPayloadReslt.error]);
            throw (buildErrorObject(400, 'EIMS1056', 'EIMSG0001', joiSeqPayloadReslt.error.message, 'payload', newSeqPayload, joiSeqPayloadReslt.error.stack));
        }
        // If the validating is successfull, override the payload with validated payload
        const valSeqData = joiSeqPayloadReslt.value;
        const valSeqPayload = _.pick(valSeqData, ['seqName', 'linkedTo', 'link']);
        valSeqPayload.seq = valSeqData.startFrom;
        if (!_.isNil(valSeqData.prefix)) {
            valSeqPayload.prefix = valSeqData.prefix;
        }

        const newSequence = new SequenceCollection(valSeqPayload);
        const result = await newSequence.save();
        clogger.debug(reqTrackingID, ['New sequence created successfully: ', result]);

        response.payload = result;
        return (response);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in create new sequence function catch is : ', error]);
        response.error = error;
        return (response);
    }
}
module.exports = createSequence;
