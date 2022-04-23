// This function match the label with the all the lables in the fields array,
// and return the object if found one
// indexToOmit takes the index value against which the label NEED NOT to be checked
function validateFieldLabelUniqueness(label, fields, indexToOmit) {
    for (let i = 0; i < fields.length; i += 1) {
        if (i !== indexToOmit) {
            if (fields[i].label === label) {
                return (fields[i]);
            }
        }
    }

    // Which means duplicate value doesn't exist
    return (false);
}

module.exports = validateFieldLabelUniqueness;
