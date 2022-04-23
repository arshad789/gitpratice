const mongooseErrorHandler = require('./mongoose_error_handler');

module.exports = function mongooseErrorMW(model) {
    model.post('save', mongooseErrorHandler);
    model.post('find', mongooseErrorHandler);
    model.post('update', mongooseErrorHandler);
};
