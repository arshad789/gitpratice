const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));
Joi.objectId = require('joi-objectid')(Joi);

const _ = require('lodash');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');


function buildJoiSchema(reqTrackingID, collection) {
    const joiSchema = {};
    const uniqueFields = [];
    const uniqueFieldsLabel = {};
    const seqFields = {};
    const phoneFields = {};

    collection.documentFieldSchema.forEach((field) => {
        let baseField;
        if (field.type === 'String') {
            baseField = Joi.string();
        } else if (field.type === 'Number') {
            baseField = Joi.number().integer();
        } else if (field.type === 'Phone') {
            // smallest phone number is in 5 numbers and largest is in 15
            baseField = Joi.string().min(5).max(15);
            // Get the phone field seq and label to be used later
            phoneFields[field.seq] = field.label;
        } else if (field.type === 'Date') {
            baseField = Joi.date().iso();
        } else if (field.type === 'RawDate') {
            baseField = Joi.date().utc().format(field.format).options({ convert: true });
        } else if (field.type === 'ObjectId') {
            baseField = Joi.objectId();
        } else if (field.type === 'Email') {
            baseField = Joi.string().email({ minDomainSegments: 2 });
        } else if (field.type === 'Sequence') {
            // As sequence filed is generated dynamically, no need to pass in payload
            baseField = Joi.any().forbidden();
        } else {
            clogger.debug(reqTrackingID, ['Invalid field type', field.type]);
            const customError = new Error(`Invalid field type: ${field.type}`);
            throw (buildErrorObject(400, 'EIMS1037', 'Invalid field type', customError.message, 'payload', field, customError.stack));
        }

        // Rest below is applicable to any field type except sequence field
        if (field.type !== 'Sequence') {
            // if field is required
            if (field.required) {
                baseField = baseField.required();
            }
            // if default has some value
            if (!(_.isNil(field.default))) {
                baseField = baseField.default(field.default);
            }
            // We have already taken care of min value not to exceed max value
            // If min is defined
            if (!(_.isNil(field.min))) {
                if (field.type === 'RawDate') {
                    baseField = baseField.min(field.minISOFormat);
                } else {
                    baseField = baseField.min(field.min);
                }
            }
            // If max is defined
            if (!(_.isNil(field.max))) {
                if (field.type === 'RawDate') {
                    baseField = baseField.max(field.maxISOFormat);
                } else {
                    baseField = baseField.max(field.max);
                }
            }
            if (field.unique) {
                uniqueFields.push(field.seq);
                uniqueFieldsLabel[field.seq] = field.label;
            }
        } else {
            seqFields[field.seq] = field.seqName;
            // Sequence fields are always unique
            // No need to check for uniqueness of sequence field
            // uniqueFields.push(field.seq);
            // uniqueFieldsLabel[field.seq] = field.label;
        }

        // *** set the label and then assign the schema
        joiSchema[field.seq] = baseField.label(field.label);
    });

    return ({
        joiSchema, uniqueFields, uniqueFieldsLabel, seqFields, phoneFields,
    });
}

module.exports = buildJoiSchema;
