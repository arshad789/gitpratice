const _ = require('lodash');
const DynamicCollection = require('../mongoose/models/dynamic_collection_model');
const clogger = require('../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');


async function getDynamicCollecSchema(reqTrackingID, collectionName) {
    clogger.info(reqTrackingID, ['Getting collection schema for reference: ', collectionName]);
    const dynamicCollecSchema = await DynamicCollection.findOne({ collectionName });
    clogger.info(reqTrackingID, ['Collection retrived from dynamic collection is : ', dynamicCollecSchema]);

    // If collection is null
    if (_.isNil(dynamicCollecSchema)) {
        const customError = new Error(`No such collection by name '${collectionName}' exist`);
        throw (buildErrorObject(400, 'EIMS1054', 'EIMSG0003', customError.message, 'database', collectionName, customError.stack));
    }
    return dynamicCollecSchema;
}
module.exports = getDynamicCollecSchema;
