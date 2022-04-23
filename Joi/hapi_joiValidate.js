// Joi Convert is disable unless forced to enabled by caller
module.exports = function hapiJoiValidate(payload, schema, joiConvert = false) {
    // abortEarly will prevent abort on first error
    // conver: false will prevent normalizing the values
    return (schema.validate(payload, { abortEarly: false, convert: joiConvert }));
};
