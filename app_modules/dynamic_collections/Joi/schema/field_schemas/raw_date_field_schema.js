/* eslint-disable max-len */
// This schema defines each dynamic filed format of any document in a dynamic collection. For example student collection has fields name, Date Of Birth, Phone, etc. Since name is a string field, the below stringField format will be applied. Which means, the label has to be min 2 and max 30 chars, it's value has to has min chars, max chars, isRequired should be either true or false and it can have a default value which is optional. Similarly for other fields, the respective field type restrictinos will be applied.

const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

// Properties which are common between new field and update filed base
const newFieldSchema = Joi.object({
    // Fields that will be generated dynamically, no need to pass in the payload

    // key is the sequence value in which the respective field is added. This value will be generated for new fields dynamically. No need to pass in the payload
    // key: Joi.number().positive().integer().min(1).required(),

    // Sequence is the key to store data in the collection. seq will be the concatination of 'field' and 'key' value above
    // For new fields it will be generated dynamically
    // seq: Joi.string().min(6).required(),

    // Defines the status of the field. Up on disabling this field, its status value will be changed accordingly
    // 0 - In Active , 1 - Active
    // For new fields, this will be assigned dynamically, no need to pass in the payload
    // status: Joi.number().min(0).max(1).required(),

    // label is the filed name, like DOB, Address, etc
    label: Joi.string().min(2).max(30).required(),

    // Defines the type of field.
    type: Joi.string().max(30).valid('RawDate').required(),

    // Defines whether the field value is mandatory or it can be null
    required: Joi.boolean().required(),

    // Defines wehter this filed is dynamic in nature or not. Means its min, max etc values can be updated
    // If it is not dynamic then only label can be updated
    dynamic: Joi.boolean().required(),

    // Defines wether this field is unique, which means it cannot contain duplicate values
    unique: Joi.boolean().required(),

    format: Joi.string().valid('DD-MM-YYYY', 'DD/MM/YYYY').required(),

    // minimum Date
    min: Joi.when('format', {
        is: 'DD-MM-YYYY',
        then: Joi.date().utc().format('DD-MM-YYYY'),
        otherwise: Joi.date().utc().format('DD/MM/YYYY'),
    }),
    // // max Date in ISO format
    max: Joi.when('format', {
        is: 'DD-MM-YYYY',
        then: Joi.date().when('min', {
            is: Joi.date().required(),
            then: Joi.date().utc().format('DD-MM-YYYY').min(Joi.ref('min')),
            otherwise: Joi.date().utc().format('DD-MM-YYYY'),
        }),
        otherwise: Joi.date().when('min', {
            is: Joi.date().required(),
            then: Joi.date().utc().format('DD/MM/YYYY').min(Joi.ref('min')),
            otherwise: Joi.date().utc().format('DD/MM/YYYY'),
        }),
    }),
});

// Properties that are applicable only to update filed
const updateFieldSchema = {
    // key is the sequence value in which the respective field is added. Use key for update and seq for everything else
    key: Joi.number().positive().integer().required(),

    // Defines the status of the field. Up on disabling this field, its status value will be changed accordingly
    // 0 - In Active , 1 - Active
    status: Joi.any().valid(0, 1).required(),
};


module.exports = { newFieldSchema, updateFieldSchema };
