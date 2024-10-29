const { _, httpContext, env } = require('./../helperFunctions/requireHelper');
const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const log = createBunyanLogger('client-request-call');
const { mockResponses } = require('./../helperFunctions/environmentFiles');
const thirdPartyApiCall = require('./thirdPartyApiCall');
const { maskHeaderObject } = require('./../helperFunctions/hideSensitiveInformation');

const clientRequestCall = async (data) => {
    const functionName = 'clientRequestCall';
    let returnHeaderOfResponse = false;
    if (data.requestBody && data.requestBody.neededCreds)
        data.requestBody = _.omit(data.requestBody, ['neededCreds', 'clientInfo']);

    const mockResponseEnabled = httpContext.get('MockResponse');
    if (mockResponseEnabled && (!env || env === 'staging')) {
        const mockRes = await getMockResponse(data.requestBody);
        if (mockRes) {
            if (mockResponseEnabled.includes('FAIL')) {
                throw mockRes;
            } else {
                return mockRes;
            }
        }
    }

    if (data && data.requestHeaders && data.requestHeaders.headers) {
        returnHeaderOfResponse = true;
        delete data.requestHeaders.headers;
    }

    if (!data.requestURI) {
        throw { errorCode: "INVALID.API.404" };
    }

    try {
        stringifyLog(data);
        const response = await thirdPartyApiCall(data);
        const finalResponse = {
            statusCode: response.status,
            body: response.data
        };
        if (returnHeaderOfResponse) {
            finalResponse.headers = response.headers;
        }
        return finalResponse;
    } catch (error) {
        log.error(functionName, 'error in request', error);
        let errorData, status;
        if (error.response) {
            errorData = error.response.data;
            ({ status } = error.response);
        }

        return {
            statusCode: status,
            message: 'Unable to fetch data, please try again later!',
            body: typeof errorData === 'object' ? errorData : {}
        };
    }
};

const getMockResponse = async (incomingData) => {
    const functionName = 'getMockResponse';
    const apiName = httpContext.get("ApiName");
    let clientName = httpContext.get("ClientName");
    const type = httpContext.get('MockResponse');
    if (clientName === 'SAMSUNG') {
        const country_code = httpContext.get('CountryCode');
        clientName = `${clientName}_${country_code}`;
    }
    const { statusCode, body, mapObject = {} } = mockResponses[clientName][apiName][type];
    log.info(functionName, `mock response ${apiName}`, mockData);
    if (!_.isEmpty(mockData)) {
        return {
            statusCode,
            body: mockData
        };
    }
    return false;
};

const stringifyLog = (data) => {
    const functionName = "clientRequestCall";
    const requestObject = _.cloneDeep(data);
    if (requestObject.requestHeaders) {
        requestObject.requestHeaders = maskHeaderObject(requestObject.requestHeaders);
    }
    try {
        log.info(functionName, 'client request call data', JSON.stringify(requestObject));
    } catch (error) {
        log.info(functionName, 'client request call data', requestObject);
    }
};

module.exports = clientRequestCall;