const Joi = require('@hapi/joi');

const newSeqSchema = Joi.object({
    // Name of the sequence. Unique across all sequences
    seqName: Joi.string().min(3).max(40).required(),

    // The minimum value of the sequence to start from
    startFrom: Joi.number().integer().min(0).default(0),

    // Sequence prefix, which will be concatinated with sequence no
    prefix: Joi.string().min(1).max(15),

    // Collection_name.fieldkey is the value
    link: Joi.boolean().default(false),

    // Collection_name.fieldkey is the value
    linkedTo: Joi.string().min(5).max(35).required(),
});

module.exports = newSeqSchema;
