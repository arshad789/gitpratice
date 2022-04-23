const express = require('express');
require('express-async-errors');
const clogger = require('../log_modules/generic/custom_logger');

const dynamicCollection = require('../app_modules/dynamic_collections/routes/routes');
const sequence = require('../generic_modules/mongodb_sequence_generator/routes/routes');


const morgan = require('../log_modules/morgan/morgan');
const expressErrorMW = require('../error_handler/middlewre/express_error_mw');
const logRequestPayloadMW = require('../log_modules/middleware/log_request_payload_mw');
const notFoundErrorMW = require('../error_handler/middlewre/not_found_error_mw');

// This is just to load the custom logger module
clogger.info('LoadingModule', 'Custom logger module loaded successfully');

module.exports = function routes(app) {
    // --- Do not shuffle anything below ---
    // First make sure a vlid json object is received
    app.use(express.json());
    app.use(logRequestPayloadMW);
    app.use(morgan);
    // --- Do not shuffle anything above ---
    // --- Define all the routes here ---
    app.use('/api/dynamic/collection', dynamicCollection);
    app.use('/api/dynamic/sequence', sequence);

    // --- Define all the routes here ---
    // --- Do not shuffle anything below ---
    // Always has to be after any valid route middleware
    app.use(notFoundErrorMW);
    // Always has to be the last middleware
    app.use(expressErrorMW);
    // --- Do not shuffle anything above ---
};
