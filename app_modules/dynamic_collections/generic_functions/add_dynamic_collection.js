
// Import required modules
const _ = require('lodash');
const DynamicCollection = require('../mongoose/models/dynamic_collection_model');
const valDynamcFieldType = require('./val_dynamic_field_type');
const dynamicCollectionSchema = require('../Joi/schema/dynamic_collection_schema');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');
const clogger = require('../../../log_modules/generic/custom_logger');
const hapiJoiValidate = require('../../../Joi/hapi_joiValidate');
const fieldPropDepndcyChckr = require('./field_prop_dependcy_checker');
const getDuplicates = require('./get_duplicate_values');
const createSequence = require('../../../generic_modules/mongodb_sequence_generator/generic_functions/create_sequence');
const valDate = require('./val_date');
const enrichFieldSchema = require('./enrich_field_schema');


async function addDynamicCollection(reqTrackingID, req) {
    const response = {};

    try {
        // Validate the payload is as per the collection model
        clogger.debug(reqTrackingID, ['Validating payload', req.body]);

        const validModel = hapiJoiValidate(req.body, dynamicCollectionSchema);

        if (validModel.error) {
            clogger.debug(reqTrackingID, ['Invalid payload received. Error Object is: ', validModel.error]);
            throw (buildErrorObject(400, 'EIMS1001', validModel.error.message, validModel.error.message, 'payload', req.body, validModel.error.stack));
        }


        clogger.debug(reqTrackingID, 'Payload validated successfully');

        // Initialize a new collection object to hold the formatted values
        let enrichedCollection;

        // Now make sure the collection name doesn't exist in the DB
        clogger.info(reqTrackingID, ['Checking any document by collection name', req.body.collectionName, 'already exist in the collection', DynamicCollection.modelName]);

        const collection = await DynamicCollection
            .findOne({ collectionName: req.body.collectionName });

        clogger.debug(reqTrackingID, ['collection object value after quering DB is : ', collection]);

        // For new collection, there shouldn't exist a collection with the same name
        if (!_.isNil(collection)) {
            const customError = new Error(`Collection '${req.body.collectionName}' already exist`);

            // Build error object
            throw (buildErrorObject(400, 'EIMS1002', customError.message, customError.message, 'database', req.body, customError.stack));
        } else {
            clogger.info(reqTrackingID, 'No such collection exist. Enriching the collection object...');
            enrichedCollection = {
                collectionName: req.body.collectionName,
                documentFieldSchema: [],
            };
            clogger.debug(reqTrackingID, ['Enriched collection object after initialization is : ', enrichedCollection]);
        }

        // Iterate throught the fields and validate the field objects are as per the defined schema
        clogger.debug(reqTrackingID, ['Iterating document filed schema array to validate each filed object', req.body.documentFieldSchema]);

        // This will hold the seq valid payload to be created
        const seqToBeCreated = [];

        const docFieldSchmLngt = req.body.documentFieldSchema.length;
        clogger.debug(reqTrackingID, ['Document field schema length is : ', docFieldSchmLngt]);
        for (let index = 0; index < docFieldSchmLngt; index += 1) {
            // Performing Joi validation for each field
            // returns the validated object which contains value or error
            let field = req.body.documentFieldSchema[index];

            clogger.debug(reqTrackingID, ['Validating field object: ', field]);
            const dynamicFieldValResult = valDynamcFieldType(field, true);
            clogger.debug(reqTrackingID, ['Joi validated value is : ', dynamicFieldValResult]);


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


            clogger.debug(reqTrackingID, ['Validationg field property dependency checker for : ', field]);
            // Validating field property dependency check
            const propDepndResult = fieldPropDepndcyChckr(field);
            if (propDepndResult) {
                // Build error object and throw error
                throw (buildErrorObject(400, 'EIMS1031', propDepndResult.message, propDepndResult.message, 'payload', field, propDepndResult.stack));
            }

            // Enrich the field
            clogger.debug(reqTrackingID, ['Enriching field schema: ', field]);
            field = enrichFieldSchema(reqTrackingID, field, index, dynamicFieldValResult.value);
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

            clogger.debug(reqTrackingID, ['value object after enrichment is, ignore seqName for now for sequence field: ', field]);
            clogger.debug(reqTrackingID, 'Pushing valid value object to collection');
            // Append the valid filed object to enriched collection initialized above
            enrichedCollection.documentFieldSchema.push(field);
            clogger.debug(reqTrackingID, ['Enriched collection array after push is: ', enrichedCollection.documentFieldSchema]);
        }


        // Capturing documentFieldSchema value to be used later
        const collectionTemp = enrichedCollection;
        const docFieldSchema = enrichedCollection.documentFieldSchema;


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
            // Its a combination of collection name and filed.
            // This will be always unique across all collections
            newSeqPayld.linkedTo = `${enrichedCollection.collectionName}.${seqToBeCreated[index].valFieldkey}`;
            // For sequence created dynamically, assign the linkedto value as sequence name
            newSeqPayld.seqName = newSeqPayld.linkedTo;
            clogger.debug(reqTrackingID, ['Creating new sequence: ', newSeqPayld]);
            const crtSeqReslult = await createSequence(reqTrackingID, newSeqPayld);
            clogger.debug(reqTrackingID, ['Create sequence result is: ', crtSeqReslult]);
            if (crtSeqReslult.error) {
                // Its already a valid error object, so just thowring as it is
                throw crtSeqReslult.error;
            }
            // update enrichCollection with the seqName
            const valFieldIndex = seqToBeCreated[index].valFieldkey - 1;
            const { seqName } = crtSeqReslult.payload;
            enrichedCollection.documentFieldSchema[valFieldIndex].seqName = seqName;
        }

        clogger.debug(reqTrackingID, ['Saving the document to the DB is: ', enrichedCollection]);
        const newDynamicCollection = new DynamicCollection(enrichedCollection);
        response.payload = await newDynamicCollection.save();
        clogger.debug(reqTrackingID, ['response object in add dynamic field function is : ', response]);
        return (response);
    } catch (error) {
        clogger.debug(reqTrackingID, ['Error object in add dynamic field function catch is : ', error]);
        response.error = error;
        return (response);
    }
}

module.exports = addDynamicCollection;
