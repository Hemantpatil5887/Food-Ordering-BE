const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const { constants } = require('./../helperFunctions/environmentFiles');
const { httpContext } = require('./../helperFunctions/requireHelper');
const clientRequestCall = require('./clientRequestCall');
const log = createBunyanLogger('retryApis');
const retryApis = async (options) => {
    const functionName = 'retryApis';
    const apiName = httpContext.get('ApiName');
    const clientName = httpContext.get('ClientName');
    const clientConfig = constants.RETRIGGER_INFO[clientName] && constants.RETRIGGER_INFO[clientName][apiName];

    const { TOTAL_ATTEMPTS, HTTP_STATUS } = clientConfig;

    let noOfAttempts = 0;
    let response;

    log.info(functionName, 'total number of attempts', TOTAL_ATTEMPTS);


    while (noOfAttempts < TOTAL_ATTEMPTS) {
        noOfAttempts++;
        log.info(functionName, 'attempt number', noOfAttempts);
        response = await clientRequestCall(options);
        if (HTTP_STATUS.indexOf(response.statusCode) > -1) {
            log.error(functionName, 'error received from client side', response);
        } else {
            return response;
        }

    };
    return response;
};

module.exports = retryApis;