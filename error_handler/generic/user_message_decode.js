function userMessageDecode(message) {
    if (message === 'EIMSG0001') {
        return ('Invalid input format');
    }
    if (message === 'EIMSG0002') {
        return ('Invalid property value');
    }
    if (message === 'EIMSG0003') {
        return ('Collection does not exist');
    }
    if (message === 'EIMSG0004') {
        return ('Document does not exist');
    }
    if (message === 'EIMSG0005') {
        return ('Sorry your request cannot be processed at the moment. Please try after some time');
    }
    if (message === 'EIMSG0400') {
        return ('Bad request');
    }
    if (message === 'EIMSG0405') {
        return ('Method not allowed');
    }

    return (message);
}

module.exports = userMessageDecode;
