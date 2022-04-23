// // *** Depricated ***

// // Validates that a collection can refer to another collection or not based on its type
// const clogger = require('../../../log_modules/generic/custom_logger');

// function valCollectionType(reqTrackingID, collectionType, valField) {
//     clogger.debug(reqTrackingID, ['parameters received in val collection type func is : ', collectionType, valField]);
//     if (collectionType === 'main') {
//         // For now disabling collection of type main
//         return (new Error(`Collection of type "${collectionType}" has been depricated`));

//         // // Then it can only have fields of type group or plain
//         // if (valField.type !== 'group' && valField.type !== 'plain') {
//         //     return (new Error(`Collection of type "${collectionType}" cannot have filed of type "${valField.type}". Valid field types are "group" & "plain"`));
//         // }
//         // return false;
//     }
//     if (collectionType === 'group') {
//         // For now disabling collection of type main
//         return (new Error(`Collection of type "${collectionType}" has been depricated`));
//         // // Then it can only have field of type plain
//         // if (valField.type !== 'plain') {
//         //     return (new Error(`Collection of type "${collectionType}" cannot have filed of type "${valField.type}". Valid field types are "plain"`));
//         // }
//         // return false;
//     }
//     if (collectionType === 'plain') {
//         // Then it cannot have field of type group or plain
//         if (valField.type === 'group' || valField.type === 'plain') {
//             return (new Error(`Collection of type "${collectionType}" cannot have filed of type "${valField.type}". Valid field types are other than "group" & "plain"`));
//         }
//         return false;
//     }
//     // Highly unlikely, but just in case
//     return (new Error(`Invalid collection type "${collectionType}"`));
// }
// module.exports = valCollectionType;
