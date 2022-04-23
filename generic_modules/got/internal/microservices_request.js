const got = require('got');
const clogger = require('../../../log_modules/generic/custom_logger');
const buildErrorObject = require('../../../error_handler/generic/build_error_object');


const intMicroSrvcReq = got.extend({
    prefixUrl: 'http://127.0.0.1:9080',
    responseType: 'json',
    headers: {
        // 'user-agent': `my-package/${pkg.version} (https://github.com/username/my-package)`,
    },
    followRedirect: false,
    // How long to wait before timing out the request. this includes retry time as well
    timeout: 20000,
    retry: {
        // No of retries
        limit: 3,
        // Time between each retry
        maxRetryAfter: 3000,
        calculateDelay: ({ attemptCount, retryOptions, error }) => {
            clogger.debug('in-before-error-hook', ['attempt count is : ', attemptCount, 'Retry Options: ', retryOptions]);
            const { response } = error;
            // As long as there is a response and status code is below 500 do not retry
            if ((response && response.body) && response.statusCode < 500) {
            // retrun 0 means stop retrying
                return 0;
            }
            // else retry based on retry limit
            // attemptCount starts counting once tried thats why less than retry limit
            return attemptCount < retryOptions.limit ? retryOptions.maxRetryAfter : 0;
        },
    },
    hooks: {
        beforeError: [
            (error) => {
                // deconstruct the error object to get only response
                const { response } = error;
                if (response && response.body) {
                    clogger.debug('in-before-error-hook', ['response body is : ', response.body, 'status code', response.statusCode]);

                    const customResponse = {
                        statusCode: response.statusCode,
                        body: response.body,
                    };
                    return (customResponse);
                }
                // Build error object
                // clogger.debug('in-before-error-hook', ['error object is : ', error]);

                return (buildErrorObject(500, 'EIMS1063', 'EIMSG0005', error.message, 'External Server', error.options.url, error.stack));
            },
        ],
    },
});

module.exports = intMicroSrvcReq;
