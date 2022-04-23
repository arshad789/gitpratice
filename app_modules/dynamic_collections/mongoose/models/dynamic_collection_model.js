const mongoose = require('mongoose');
const mongooseErrorMW = require('../../../../error_handler/mongoose/mongoose_error_mw');

const dynamicCollection = new mongoose.Schema({
    // Collection name, will be used to link the collection only.
    // Name will be used only for core collection
    // For rest the ref value will be used to add documents to the collection
    collectionName: {
        type: String, minlength: 3, maxlength: 30, required: true, unique: true,
    },
    // This contins all fileds meta data. Means, label, type, min & max etc
    documentFieldSchema: { type: mongoose.Schema.Types.Mixed },
},
{
    timestamps: true,
});

// Mongoose error middleware to handle DB errors.
// *** This middleware has to be defined right after schema initialization ***
mongooseErrorMW(dynamicCollection);

const DynamicCollection = mongoose.model('dynamic_collections', dynamicCollection, 'dynamic_collections');

module.exports = DynamicCollection;
