const Joi = require('@hapi/joi');

const nextSeqSchema = Joi.object({
    // _id is the sequence name
    seqName: Joi.string().min(3).max(40).required(),
});

module.exports = nextSeqSchema;
