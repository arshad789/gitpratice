const buildErrorObject = require('../generic/build_error_object');
const clogger = require('../../log_modules/generic/custom_logger');

function mongooseErrorHandler(error, doc, next) {
    if (error.name === 'ValidationError') {
        clogger.debug('undefined', ['Mongo Error: ', error, 'Mongo doc', doc]);
        const message = 'DB validation error';
        return next(buildErrorObject(400, 'EIMS1009', message, error.message, 'database', error.errors, error.stack));
    }

    if (error.name === 'MongoError' && error.code === 11000) {
        // get key value and put it in message
        const message = 'Duplicate key error';
        const location = error.message.split('E11000 duplicate key error ');
        return next(buildErrorObject(400, 'EIMS1010', message, error.message, 'database', location, error.stack));
    }

    const message = 'DB error';
    return next(buildErrorObject(500, 'EIMS1011', message, error.message, 'database', doc, error.stack));
}

module.exports = mongooseErrorHandler;
