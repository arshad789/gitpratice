// // *** Depricated ***

// const _ = require('lodash');
// const clogger = require('../../../log_modules/generic/custom_logger');

// // This function make sures
// // 1. A collection reference exist
// // 2. A reference isn't referring to main collection
// // 3. Reference isn't refering to same collection
// // 4. A collection of type group isn't referring to another group collection

// function valFieldReference(reqTrackingID, collectionType, dynamicCollecRefrncs, valField) {
//     clogger.debug(reqTrackingID, ['Parameters received in validate field reference function is : ', collectionType, dynamicCollecRefrncs, valField]);

//     // ** link: true will implicitly doesn't include main collections
//     // ** Field type is already taken care, so no need to worry
//     const valRef = { ref: valField.reference, link: true, type: valField.type };
//     clogger.debug(reqTrackingID, ['Valid reference value is : ', valRef]);
//     if (_.findIndex(dynamicCollecRefrncs, valRef) === -1) {
//         return (new Error(`No such collection reference "${valField.reference}" for field type "${valField.type}" exist or reference is main table and cannot be linked`));
//     }
//     return false;
// }
// module.exports = valFieldReference;
