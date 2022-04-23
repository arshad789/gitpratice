const Joi = require('@hapi/joi');
// 'ref' and 'link' are not added because it will be generated dynamically
// and we are not expecting this part of the payload from frontend
// This will also help us in ensuring these properties cannot be override by the frontend app
// And if we miss dynamic generate, then mongoose validation will cover us
const dynamicCollectionSchema = Joi.object({
    // Collection Name
    collectionName: Joi.string().min(3).max(30).required(),
    // Dyanmic document schema array for each field
    documentFieldSchema: Joi.array().min(1).required(),
});
// const existngCollec = {
//     name: Joi.string().min(3).max(30).required(),
//     documentFieldSchema: Joi.array().min(1).required(),
// };

module.exports = dynamicCollectionSchema;
