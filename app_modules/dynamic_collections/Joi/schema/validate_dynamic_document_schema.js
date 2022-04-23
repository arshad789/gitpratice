const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);


const addDynDocSchma = Joi.object({
    // Collection Name
    collectionName: Joi.string().min(3).max(30).required(),
    // dynamic document to add
    document: Joi.any().required(),
    // call back context for find by value
    callBackValueContext: Joi.string().required(),
});

const updateDynDocSchma = Joi.object({
    // Collection Name
    collectionName: Joi.string().min(3).max(30).required(),
    // document id which is being updated
    sif: Joi.number().integer().required(),
    // updated dynamic doucment
    document: Joi.any().required(),
    // Existing dynamic document
    existingDoc: Joi.any().required(),
    // call back context for find by value
    callBackValueContext: Joi.string().required(),
});

const getDynDocSchma = Joi.object({
    collectionName: Joi.string().min(3).max(30).required(),
    sif: Joi.number().integer().required(),
});


module.exports = { addDynDocSchma, updateDynDocSchma, getDynDocSchma };
