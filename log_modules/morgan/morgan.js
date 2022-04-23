const morgan = require('morgan');
const config = require('config');
const rfs = require('rotating-file-stream');


// create a rotating write stream
const accessLogStream = rfs.createStream(config.get('EIMS.server.log.access.filename'), {
    interval: config.get('EIMS.server.log.access.rotation.interval'),
    size: config.get('EIMS.server.log.access.rotation.size'),
    path: config.get('EIMS.server.log.access.home'),
});

// setup the logger
module.exports = morgan(config.get('EIMS.server.log.access.format'), { stream: accessLogStream });
