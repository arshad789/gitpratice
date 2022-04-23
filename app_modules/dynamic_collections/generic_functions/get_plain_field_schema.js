// /* eslint-disable no-await-in-loop */
// const Joi = require('joi');
// const _ = require('lodash');
// const clogger = require('../../../log_modules/generic/custom_logger');
// const buildJoiSchema = require('./build_joi_schema');
// const getDynamicCollecSchema = require('./get_dynamic_collection_schema');


// // This function takes collection of type plain and return the joi schema and unique fileds
// async function getPlainFieldSchema(reqTrackingID, plainFields) {
//     clogger.debug(reqTrackingID, ['Parameters received in get plain field schema is : ', plainFields]);
//     const plainFieldSchema = {};
//     const uniqueFieldsCollec = {};
//     for (let i = 0; i < plainFields.length; i += 1) {
//         // For each plain type field, get the schema from dynamic collections
//         const plainColleRef = plainFields[i].reference;
//         const plainFieldSeq = plainFields[i].seq;
//         const plainCollecSchema = await getDynamicCollecSchema(reqTrackingID, plainColleRef);
//         clogger.debug(reqTrackingID, ['Assigning plain field schema to sequence:  ', plainFieldSeq]);

//         // Calling build joi schma for this plain collection
//         const { joiSchema, uniqueFields } = buildJoiSchema(reqTrackingID, plainCollecSchema);

//         // Make the field required
//         if (plainFields[i].required) {
//             plainFieldSchema[plainFieldSeq] = Joi.object().keys(joiSchema).required();
//         } else {
//             plainFieldSchema[plainFieldSeq] = Joi.object().keys(joiSchema);
//         }

//         // capture the unique fields if it is not empty
//         if (!_.isEmpty(uniqueFields)) {
//             uniqueFieldsCollec[plainFieldSeq] = uniqueFields;
//             clogger.debug(reqTrackingID, ['Unique fields capture for plain field ref: ', plainColleRef, 'And sequence is : ', plainFieldSeq, 'are : ', uniqueFieldsCollec]);
//         }
//     }
//     return ({ plainFieldSchema, uniqueFieldsCollec });
// }
// module.exports = getPlainFieldSchema;
