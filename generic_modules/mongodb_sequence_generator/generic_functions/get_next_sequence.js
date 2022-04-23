const _ = require('lodash');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');
const SequenceCollection = require('../mongoose/models/sequence_model');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');
const nextSeqSchema = require('../Joi/schema/next_sequence_schema');

// lets take all the sequence at once and return accordingly
async function getNextSequence(reqTrackingID, parameters) {
    clogger.debug(reqTrackingID, ['Validating sequence paylod', parameters]);
    const joiSeqPayloadReslt = hapiJoiValidate(parameters, nextSeqSchema);

    if (joiSeqPayloadReslt.error) {
        clogger.info(reqTrackingID, ['Invalid payload received. Error Object is: ', joiSeqPayloadReslt.error]);
        throw (buildErrorObject(400, 'EIMS1056', 'EIMSG0001', joiSeqPayloadReslt.error.message, 'payload', parameters, joiSeqPayloadReslt.error.stack));
    }
    const { seqName } = parameters;
    clogger.debug(reqTrackingID, ['Getting next sequence for seq name: ', seqName]);
    const result = await SequenceCollection.findOneAndUpdate(
        { seqName },
        { $inc: { seq: 1 } },
        { new: true, upsert: false },
    // select will exclude _id and only returns seq & prefix
    ).select({ _id: 0, seq: 1, prefix: 1 });

    if (_.isNil(result)) {
        const customError = new Error(`Invalid sequence name: '${seqName}'`);
        // Its highly unlikely that we will get invalid sequence, hence raising 400
        throw (buildErrorObject(400, 'EIMS1061', customError.message, customError.message, 'database', seqName, customError.stack));
    }

    // concat with prefix if prefix exist then send the sequence
    const nextSeq = result.prefix ? `${result.prefix}${result.seq}` : `${result.seq}`;
    clogger.debug(reqTrackingID, ['Next sequence for: ', seqName, 'is: ', nextSeq]);
    return (nextSeq);
}
module.exports = getNextSequence;
