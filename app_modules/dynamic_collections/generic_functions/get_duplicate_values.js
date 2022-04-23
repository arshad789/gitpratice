const _ = require('lodash');
const clogger = require('../../../log_modules/generic/custom_logger');

// It will take collection, key as an input and return duplicate if exist
function getDuplicates(reqTrackingID, collection, key) {
    clogger.debug(reqTrackingID, ['Parameters received in get duplicates is : ', collection, key]);
    clogger.debug(reqTrackingID, ['Getting values for key: ', key]);
    const values = _.map(collection, key);
    clogger.debug(reqTrackingID, ['Values retrived are: ', values]);

    // ** collec is nothing but values, i is index, val is value at that index
    // ** includes will look for val in collec, starting from index (i + 1)
    const duplicates = _.filter(values, (val, i, collec) => _.includes(collec, val, i + 1));
    return (_.isEmpty(duplicates) ? false : _.uniq(duplicates));
}
module.exports = getDuplicates;
