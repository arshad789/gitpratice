/* eslint-disable max-len */
// Import required modules
// test for bitbucket
const _ = require('lodash');
const DynamicCollection = require('../mongoose/models/dynamic_collection_model');
const valDynamcFieldType = require('./val_dynamic_field_type');
const dynamicCollectionSchema = require('../Joi/schema/dynamic_collection_schema');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');

const fieldPropDepndcyChckr = require('./field_prop_dependcy_checker');
const getDuplicates = require('./get_duplicate_values');
const valUpdatedField = require('./val_updated_field');
const createSequence = require('../../../generic_modules/mongodb_sequence_generator/generic_functions/create_sequence');
const valDate = require('./val_date');
const enrichFieldSchema = require('./enrich_field_schema');


async function addUpdtDynamicCollecField(reqTrackingID, req, newField, updateField) {
    const response = {};

    try {
        // Validate the payload is as per the collection model
        clogger.debug(reqTrackingID, ['Validating payload', req.body]);

        const validModel = hapiJoiValidate(req.body, dynamicCollectionSchema);

        if (validModel.error) {
            clogger.debug(reqTrackingID, ['Invalid payload received. Error Object is: ', validModel.error]);
            throw (buildErrorObject(400, 'EIMS1001', validModel.error.message, validModel.error.message, 'payload', req.body, validModel.error.stack));
        }

        // For now supporting only one field add/update at a time
        if (newField || updateField) {
            if (req.body.documentFieldSchema.length !== 1) {
                const customError = new Error('child "documentFieldSchema" array length should be equal to 1');
                // Build error object
                throw (buildErrorObject(400, 'EIMS1026', 'EIMSG0001', customError.message, 'payload', req.body, customError.stack));
            }
        }

        clogger.debug(reqTrackingID, 'Payload validated successfully');

        // Now make sure the collection name exist in the DB
        clogger.info(reqTrackingID, ['Checking any document by collection name', req.body.collectionName, 'already exist in the collection', DynamicCollection.modelName]);

        const collection = await DynamicCollection
            .findOne({ collectionName: req.body.collectionName });

        clogger.debug(reqTrackingID, ['collection object value after quering DB is : ', collection]);

        // ** fidnone will only get one collection, so just need to check its not null
        if (_.isNil(collection)) {
            const customError = new Error(`Collection '${req.body.collectionName}' does not exist`);
            // Build error object
            throw (buildErrorObject(400, 'EIMS1006', customError.message, customError.message, 'database', req.body, customError.stack));
        } else {
            // if we reach here this means only one such collection exist
            clogger.info(reqTrackingID, ['Only one such collection exist', collection]);
        }
        const { collectionName } = collection;

        // Iterate throught the fields and validate the field objects are as per the defined schema
        clogger.debug(reqTrackingID, ['Iterating document filed schema array to validate each filed object', req.body.documentFieldSchema]);

        // To store the new filed after enrichment. Only applicable to existing collection
        let field;

        // This will hold the seq valid payload to be created
        const seqToBeCreated = [];

        const docFieldSchmLngt = req.body.documentFieldSchema.length;
        clogger.debug(reqTrackingID, ['Document field schema length is : ', docFieldSchmLngt]);
        for (let index = 0; index < docFieldSchmLngt; index += 1) {
            // Performing Joi validation for each field
            // returns the validated object which contains value or error
            field = req.body.documentFieldSchema[index];
            clogger.debug(reqTrackingID, ['Validating field object: ', field]);
            // const { error, value: valField } = (newField) ? valDynamcFieldType(field, true) : valDynamcFieldType(field, false);
            const dynamicFieldValResult = (newField) ? valDynamcFieldType(field, true) : valDynamcFieldType(field, false);


            // If the validated Object schema contains error, then throw error
            if (dynamicFieldValResult.error) {
                // Build error object and throw error
                throw (buildErrorObject(400, 'EIMS1003', dynamicFieldValResult.error.message, dynamicFieldValResult.error.message, 'payload', field, dynamicFieldValResult.error.stack));
            } else {
                clogger.debug(reqTrackingID, ['Joi validataion is successfull for field: ', field]);
            }

            // Since Joi only validates the date format but not the value
            if (field.type === 'Date') {
                const valDateResult = valDate(reqTrackingID, field);
                // If field is not valid date, then throw error
                if (valDateResult.error) {
                    // Build error object and throw error
                    throw (buildErrorObject(400, 'EIMS1061', valDateResult.error.message, valDateResult.error.message, 'payload', field, valDateResult.error.stack));
                }
            }

            // If updating field make sure it adhere to the rules
            if (updateField) {
                clogger.debug(reqTrackingID, ['Validating the updated filed adheres to the rules', field]);
                const invalidField = valUpdatedField(reqTrackingID, collection, field);
                if (invalidField) {
                    throw (buildErrorObject(400, 'EIMS1053', 'EIMSG0001', invalidField.message, 'payload', [collection, field], invalidField.stack));
                }
            }

            clogger.debug(reqTrackingID, ['Validating field property dependency checker for : ', field]);
            // Validating field property dependency check
            const propDepndResult = fieldPropDepndcyChckr(field);
            if (propDepndResult) {
                // Build error object and throw error
                throw (buildErrorObject(400, 'EIMS1031', propDepndResult.message, propDepndResult.message, 'payload', field, propDepndResult.stack));
            }

            // If new field, then enrich it
            if (newField) {
                // Enrich the field
                clogger.debug(reqTrackingID, ['Enriching field schema: ', field]);
                field = enrichFieldSchema(reqTrackingID, field, collection.documentFieldSchema.length, dynamicFieldValResult.value);
                clogger.debug(reqTrackingID, ['field schema after enrichment is: ', field]);

                // Collecting the sequences to be created
                if (field.type === 'Sequence') {
                    // Collect all sequence to be created in seqToBeCreated array
                    const newSeqPayld = _.pick(field, ['startFrom', 'prefix']);
                    // Will use this index later to update the seq_id in enrichedCollection
                    newSeqPayld.valFieldkey = field.key;
                    // marking that its linked to this field
                    newSeqPayld.link = true;
                    seqToBeCreated.push(newSeqPayld);
                    clogger.debug(reqTrackingID, ['Sequences to be created after each push is: ', seqToBeCreated]);
                }
                clogger.debug(reqTrackingID, ['Field after enrichment is: ', field]);

                clogger.debug(reqTrackingID, 'Pushing valid value object to collection');
                // Append the valid filed value to the DB object retrived above
                collection.documentFieldSchema.push(field);
                clogger.debug(reqTrackingID, ['DB collection array after push is: ', collection.documentFieldSchema]);
            }


            if (updateField) {
                clogger.debug(reqTrackingID, 'Updating valid value object to collection');
                // Now updating the old field with ONLY updated properties
                const modFieldIndex = field.key - 1;
                let oldField = collection.documentFieldSchema[modFieldIndex];

                // kick off min/max field based on its presence in payload
                clogger.debug(reqTrackingID, ['Removing min/max keys based on payload: ', field, 'old filed ', oldField]);

                if (_.isNil(field.min)) {
                    oldField = _.omit(oldField, ['min']);
                    clogger.debug(reqTrackingID, ['Old filed after min remove is : ', oldField]);
                }
                if (_.isNil(field.max)) {
                    oldField = _.omit(oldField, ['max']);
                    clogger.debug(reqTrackingID, ['Old filed after max remove is : ', oldField]);
                }
                clogger.debug(reqTrackingID, ['Merging updated field: ', field, 'With old filed ', oldField]);
                const mergeResult = Object.assign(oldField, field);
                clogger.debug(reqTrackingID, ['Merge result is : ', mergeResult]);
                collection.documentFieldSchema[modFieldIndex] = mergeResult;
                clogger.debug(reqTrackingID, ['Collection object after updating is : ', collection]);
            }
        }


        // Capturing documentFieldSchema value to be used later
        const collectionTemp = collection;
        const docFieldSchema = collection.documentFieldSchema;


        // Validate the labels are unique
        clogger.debug(reqTrackingID, ['Calling get duplicates for "label" in collection: ', collectionTemp]);
        const duplicateLabel = getDuplicates(reqTrackingID, docFieldSchema, 'label');
        if (duplicateLabel) {
            const customError = new Error(`Two fields cannot have the same label '${duplicateLabel}'`);
            // Build error object
            throw (buildErrorObject(400, 'EIMS1004', customError.message, customError.message, 'payload', [docFieldSchema, duplicateLabel], customError.stack));
        }

        // Creating sequences here because there is a possibility that collection creation
        // will fail due to lables are not being unique
        for (let index = 0; index < seqToBeCreated.length; index += 1) {
            // Call create new sequence here
            const newSeqPayld = _.pick(seqToBeCreated[index], ['startFrom', 'prefix', 'link']);
            // Its a combination of collection name and filed. This will be always unique across all collections
            newSeqPayld.linkedTo = `${collectionName}.${seqToBeCreated[index].valFieldkey}`;
            // For sequence created dynamically, assign the linkedto value as sequence name
            newSeqPayld.seqName = newSeqPayld.linkedTo;
            clogger.debug(reqTrackingID, ['Creating new sequence: ', newSeqPayld]);
            const crtSeqReslult = await createSequence(reqTrackingID, newSeqPayld);
            clogger.debug(reqTrackingID, ['Create sequence result is: ', crtSeqReslult]);
            if (crtSeqReslult.error) {
                // Its already a valid error object, so just thowring as it is
                throw crtSeqReslult.error;
            }
            // update enrichCollection with the seqID
            const valFieldIndex = seqToBeCreated[index].valFieldkey - 1;
            const { seqName } = crtSeqReslult.payload;
            collection.documentFieldSchema[valFieldIndex].seqName = seqName;
        }


        clogger.debug(reqTrackingID, ['Updating the collection', collectionName, 'with the new/updated field(s): ', field]);

        // Since 'documentFieldSchema' is of type mixed, we have to markModified first
        // collection represents the DB object retrived above
        collection.markModified('documentFieldSchema');
        response.payload = await collection.save();
        clogger.info(reqTrackingID, ['Updated collection is: ', response.payload]);

        clogger.debug(reqTrackingID, ['response object in add dynamic field function is : ', response]);
        return (response);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in add dynamic field function catch is : ', error]);
        response.error = error;
        return (response);
    }
}

module.exports = addUpdtDynamicCollecField;
