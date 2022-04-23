const _ = require('lodash');
// This function makes sure the different properties of a field doesn't contradicts with each other
function fieldPropDepndcyChckr(field) {
    // Scenario 1
    // If unique is true, require should be true and default should be null
    // If required is true, default is null
    let userMessage = '';
    let error = false;
    const requireMSG = "'required' must be true, when field is unique. ";
    const defaultMSG = 'cannot have value default value when required is true';
    // Applicable to all fields
    // If field unique is ture
    if (field.unique) {
        if (!field.required) {
            error = true;
            userMessage = requireMSG;
        }
        if (!(_.isNil(field.default))) {
            error = true;
            userMessage += defaultMSG;
        }
        if (error) {
            return (new Error(userMessage));
        }
    // If field unique is not true and required is true
    } else if (field.required) {
        if (!(_.isNil(field.default))) {
            return (new Error(defaultMSG));
        }
    }

    return (error);
}

module.exports = fieldPropDepndcyChckr;
