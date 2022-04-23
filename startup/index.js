/* eslint-disable no-console */
// First thing first, set the environment
process.env.NODE_CONFIG_ENV = 'development';
process.env.NODE_CONFIG_DIR = '../config';
process.env.EIMS_DEBUG = 'true';


// Load the require modules in sequence
const config = require('config');
require('./eims_data_base')();

const express = require('express');
const logger = require('../log_modules/winston/winston_logger');

const app = express();

// Load all the routes from routes.js and assing to app
require('./routes')(app);

// Create a server
const server = app.listen(config.EIMS.server.port, () => {
    logger.info(`Application Server started on port: ', ${config.EIMS.server.port}`);
    logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    logger.info(`NODE_CONFIG_ENV: ${process.env.NODE_CONFIG_ENV}`);
    logger.info(`DEBUG Mode: ${process.env.EIMS_DEBUG}`);
});

// set global request time out here
server.setTimeout(config.EIMS.server.timeouts.global.request);
