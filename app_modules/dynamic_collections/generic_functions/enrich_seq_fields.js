const _ = require('lodash');
const getNextSequence = require('../../../generic_modules/mongodb_sequence_generator/generic_functions/get_next_sequence');
const clogger = require('../../../log_modules/generic/custom_logger');


async function enrichSeqFields(reqTrackingID, seqFields) {
    const enrichedSeqFields = {};
    clogger.debug(reqTrackingID, ['Sequence fields received in enrich sequence field function is : ', seqFields]);
    const seqFieldKeys = _.keys(seqFields);
    clogger.debug(reqTrackingID, ['Sequence field keys are: ', seqFieldKeys]);
    for (let i = 0; i < seqFieldKeys.length; i += 1) {
        // get the seq id to send to getNextSequence function
        const seqName = seqFields[seqFieldKeys[i]];
        clogger.debug(reqTrackingID, ['Getting sequence for field: ', seqFieldKeys[i], 'and sequence name: ', seqName]);

        const parameters = {
            seqName,
        };
        clogger.debug(reqTrackingID, ['Parameters being sent to get next sequence function is : ', parameters]);

        enrichedSeqFields[seqFieldKeys[i]] = await getNextSequence(reqTrackingID, parameters);
    }
    return enrichedSeqFields;
}

module.exports = enrichSeqFields;
