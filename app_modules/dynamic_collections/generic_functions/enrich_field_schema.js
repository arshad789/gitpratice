// Load required modules
const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');

// This function enriches field schema for new fields only
function enrichFieldSchema(reqTrackingID, field, index, joiEnrichedField) {
    clogger.debug(reqTrackingID, ['Parameters received in enrich field schmea function is , field : ', field, 'Joi enriched filed is: ', joiEnrichedField]);
    const enrichedField = field;
    // Adding key
    enrichedField.key = index + 1;

    // Add sequence of the field based on key value
    enrichedField.seq = `field${enrichedField.key}`;

    // for new fields status is always active
    enrichedField.status = 1;

    // Collecting the sequences to be created
    if (field.type === 'Sequence') {
        // we can take the below joi validated value
        enrichedField.startFrom = joiEnrichedField.startFrom;
        enrichedField.required = joiEnrichedField.required;
        enrichedField.unique = joiEnrichedField.unique;
        enrichedField.dynamic = joiEnrichedField.dynamic;
    }

    // Get the iso converted value for RawDate
    if (field.type === 'RawDate') {
        // If min date is defined
        if (!_.isNil(field.min)) {
            enrichedField.minISOFormat = joiEnrichedField.min;
        }
        // If min date is defined
        if (!_.isNil(field.max)) {
            enrichedField.maxISOFormat = joiEnrichedField.max;
        }
    }

    return enrichedField;
}
module.exports = enrichFieldSchema;
