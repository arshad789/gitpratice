const mongoose = require('mongoose');
const mongooseErrorMW = require('../../../../error_handler/mongoose/mongoose_error_mw');

// This model is generic & applicable to the collections mentioned in dynamic_collection collection
const documentModel = new mongoose.Schema({
    document: { type: mongoose.Schema.Types.Mixed, required: true },
},
{
    timestamps: true,
});

// Mongoose error middleware to handle DB errors.
// *** This middleware has to be defined right after schema initialization ***
mongooseErrorMW(documentModel);

module.exports = documentModel;
