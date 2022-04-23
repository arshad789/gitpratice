const mongoose = require('mongoose');
const mongooseErrorMW = require('../../../../error_handler/mongoose/mongoose_error_mw');

const sequenceModel = new mongoose.Schema({
    // Sequence Name. Will use this to get the sequence in next sequence fucntion
    seqName: {
        type: String, minlength: 3, maxlength: 40, required: true, unique: true,
    },
    // This will hold the sequence value
    seq: {
        type: Number, minlength: 0, required: true,
    },
    // Is it linked to any collection
    link: {
        type: Boolean, default: false,
    },
    // Which field of a collection its linked to. Collection_name.fieldkey is the value
    linkedTo: {
        type: String, minlength: 5, maxlength: 35, required: true, unique: true,
    },
    prefix: {
        type: String, minlength: 2, maxlength: 15,
    },
},
{
    timestamps: true,
});

// Mongoose error middleware to handle DB errors.
// *** This middleware has to be defined right after schema initialization ***
mongooseErrorMW(sequenceModel);

const SequenceCollection = mongoose.model('sequences', sequenceModel, 'sequences');

module.exports = SequenceCollection;
