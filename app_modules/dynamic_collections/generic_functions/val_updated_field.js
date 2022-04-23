const clogger = require('../../../log_modules/generic/custom_logger');

function valUpdatedField(reqTrackingID, collection, valField) {
    clogger.debug(reqTrackingID, ['Parameters received in validate updated field is : ', collection, valField]);
    clogger.debug(reqTrackingID, ['Making sure the key value: ', valField.key, 'is well with in range']);
    const docFieldSchmaLenght = collection.documentFieldSchema.length;
    if (valField.key > docFieldSchmaLenght) {
        return (new Error(`key value ${valField.key} exceeds document field schema array length ${docFieldSchmaLenght}`));
    }
    const modFieldIndex = valField.key - 1;
    clogger.debug(reqTrackingID, ['Modified field index value is : ', modFieldIndex]);

    const oldField = collection.documentFieldSchema[modFieldIndex];
    clogger.debug(reqTrackingID, ['Making sure the field is in dynamic in nature: ', oldField]);
    if (!oldField.dynamic) {
        return (new Error('Cannot update non-dynamic field'));
    }

    clogger.debug(reqTrackingID, ['comparing fields', valField, oldField, 'to know restricted fields are modified or not']);
    if (valField.type !== oldField.type) {
        return (new Error(`Field type did not match', ${valField.type}, ${oldField.type}`));
    }
    if (!oldField.unique && valField.unique) {
        return (new Error(`Cannot update unique from '${oldField.unique}' to '${valField.unique}'`));
    }
    return false;
}
module.exports = valUpdatedField;
