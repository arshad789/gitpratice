const Joi = require('@hapi/joi');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');

const stringField = require('../Joi/schema/field_schemas/string_field_schema');
const numberFieldSchema = require('../Joi/schema/field_schemas/number_field_schema');
const phoneNumberFieldSchema = require('../Joi/schema/field_schemas/phone_number_field_schema');
const dateFieldSchema = require('../Joi/schema/field_schemas/date_field_schema');
const rawDateFieldSchema = require('../Joi/schema/field_schemas/raw_date_field_schema');
const emailFieldSchema = require('../Joi/schema/field_schemas/email_field_schema');
const sequenceFieldSchema = require('../Joi/schema/field_schemas/sequence_field_schema');


// Validates each filed schema of dynamic collection
// isNew decides wehter the filed is new or updating an existng one. Based on this it will validate
// aganist respective schema
function valDynamcFieldType(field, isNew) {
    let fieldSchema;
    let updateFieldSchema;
    // This parameter will decide wether joi should enrich payload first and then validate
    let joiConvert = false;
    const invalidFieldschema = Joi.object({
        // Defines the type of field. Only vlaid values are allowed
        type: Joi.string().max(30).valid('String', 'Number', 'Phone', 'Date', 'RawDate', 'Email', 'Sequence').required(),
    });

    // Get the type of the filed and assign respecitve filed schema
    if (field.type === 'String') {
        fieldSchema = stringField.newFieldSchema;
        updateFieldSchema = stringField.updateFieldSchema;
    } else if (field.type === 'Number') {
        fieldSchema = numberFieldSchema.newFieldSchema;
        updateFieldSchema = numberFieldSchema.updateFieldSchema;
    } else if (field.type === 'Phone') {
        fieldSchema = phoneNumberFieldSchema.newFieldSchema;
        updateFieldSchema = phoneNumberFieldSchema.updateFieldSchema;
    } else if (field.type === 'Date') {
        fieldSchema = dateFieldSchema.newFieldSchema;
        updateFieldSchema = dateFieldSchema.updateFieldSchema;
        joiConvert = true;
    } else if (field.type === 'RawDate') {
        fieldSchema = rawDateFieldSchema.newFieldSchema;
        updateFieldSchema = rawDateFieldSchema.updateFieldSchema;
        joiConvert = true;
    } else if (field.type === 'Email') {
        fieldSchema = emailFieldSchema.newFieldSchema;
        updateFieldSchema = emailFieldSchema.updateFieldSchema;
    } else if (field.type === 'Sequence') {
        fieldSchema = sequenceFieldSchema.newFieldSchema;
        updateFieldSchema = sequenceFieldSchema.updateFieldSchema;
    } else {
        return (invalidFieldschema.validate(field, { convert: false }));
    }
    // Append the update filed schema
    if (!isNew) {
        fieldSchema = fieldSchema.append(updateFieldSchema);
    }

    // Call joi validate to validate the dynamic field schema
    return hapiJoiValidate(field, fieldSchema, joiConvert);
}

module.exports = valDynamcFieldType;
