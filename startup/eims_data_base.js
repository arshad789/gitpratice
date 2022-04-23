/* eslint-disable no-console */
// Now load the config module to reflect the environment specific values
const config = require('config');
const mongoose = require('mongoose');
const logger = require('../log_modules/winston/winston_logger');

module.exports = function eims() {
    const url = `${config.EIMS.datasources.ds1.host}:${config.EIMS.datasources.ds1.port}`;
    const dbName = config.EIMS.datasources.ds1.db_name;
    const dbOptions = {
        // autoReconnect: config.EIMS.datasources.ds1.options.autoReconnect,
        poolSize: config.EIMS.datasources.ds1.options.poolSize,
        connectTimeoutMS: config.EIMS.datasources.ds1.options.connectTimeoutMS,
        socketTimeoutMS: config.EIMS.datasources.ds1.options.socketTimeoutMS,
        // reconnectTries: config.EIMS.datasources.ds1.options.reconnectTries,
        // reconnectInterval: config.EIMS.datasources.ds1.options.reconnectInterval,
        bufferMaxEntries: config.EIMS.datasources.ds1.options.bufferMaxEntries,
        useNewUrlParser: config.EIMS.datasources.ds1.options.useNewUrlParser,
        validateOptions: config.EIMS.datasources.ds1.options.validateOptions,
        useCreateIndex: config.EIMS.datasources.ds1.options.useCreateIndex,
        useFindAndModify: config.EIMS.datasources.ds1.options.useFindAndModify,
        useUnifiedTopology: config.EIMS.datasources.ds1.options.useUnifiedTopology,
    };

    mongoose.connect(`mongodb://${url}/${dbName}`, dbOptions)
        .then(() => {
            logger.info(`Successfully connected to the database: mongodb://${url}/${dbName}`);
            console.log(`Successfully connected to the database: mongodb://${url}/${dbName}`);
        })
        .catch((error) => logger.error(`Failed to connect to the database, Error: ', ${error.message}`));
};
