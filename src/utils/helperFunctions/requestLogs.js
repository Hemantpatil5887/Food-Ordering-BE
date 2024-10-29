const { httpContext, _ } = require('./requireHelper');
const createBunyanLogger = require('./createBunyanLogger');
const { constants } = require('./environmentFiles');
const stringifyData = require('./stringifyData');
const log = createBunyanLogger('request-log');

const requestLogs = async (upstreamResponse) => {
    const functionName = 'requestLogs';
    const apiName = httpContext.get('ApiName') || {};
    const upstreamRequestDetails = httpContext.get('upstreamRequest');
    delete upstreamRequestDetails?.clientInfo;
    delete upstreamRequestDetails?.neededCreds;
    const requestDetails = {
        upstreamRequest: stringifyData(upstreamRequestDetails),
        upstreamResponse: stringifyData(upstreamResponse)
    };

    if (httpContext.get('clientRequest')) {
        const clientRequest = httpContext.get('clientRequest');
        requestDetails.clientRequest = stringifyData(clientRequest.request);
        requestDetails.clientResponse = stringifyData(clientRequest.response);
        requestDetails.clientStatus = stringifyData(clientRequest.status);
    }

    if ((!_.isEmpty(requestDetails.upstreamRequest) || !_.isEmpty(requestDetails.upstreamResponse))
    && !constants?.SKIP_APIS_LOGS?.[apiName]) {
        log.request(functionName, 'request details', requestDetails);
    }

    return;
};

module.exports = requestLogs;