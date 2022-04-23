/* eslint-disable max-len */
// This schema defines the field type string restrictions and valid values

const Joi = require('@hapi/joi');


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

    // Defines the type of field. Only vlaid values are allowed
    // Forced to kept this in common filed. Actually need to be part of new field only, but requreid in update field as well to know the field type. It cannot be changed but needed to validate the field
    type: Joi.string().valid('String').required(),

    // Defines whether the field value is mandatory or it can be null
    required: Joi.boolean().required(),

    // Defines wehter this filed is dynamic in nature or not. Means its min, max etc values can be updated
    // If it is not dynamic then only label can be updated
    dynamic: Joi.boolean().required(),

    // Defines wether this field is unique, which means it cannot contain duplicate values
    unique: Joi.boolean().required(),

    // Defines the minimum number of characters required
    min: Joi.number().positive().integer().required()
        .max(Joi.ref('max')),

    // Defines the maximum number of characters required
    max: Joi.number().positive().integer().max(300)
        .required(),

    // Defines the default field value, if not provided
    default: Joi.string()
        .when('min', {
            is: Joi.number().required(),
            then: Joi.string().min(Joi.ref('min')).max(Joi.ref('max')),
            otherwise: Joi.string().max(Joi.ref('max')),
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
