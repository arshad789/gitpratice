const _ = require('lodash');

const phoneFields = {};
if (!_.isEmpty(phoneFields)) {
    console.log('Is not nil');
} else {
    console.log('Is Nil');
}
