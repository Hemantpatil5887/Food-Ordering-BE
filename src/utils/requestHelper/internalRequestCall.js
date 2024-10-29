const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const log = createBunyanLogger('internal-request-call');
const thirdPartyApiCall = require('./thirdPartyApiCall');
const { internalApi } = require("../helperFunctions/environmentFiles");

const internalRequestCall = async (requestData) => {
    const functionName = 'internalRequestCall';
    const { requestMethod, requestHeaders, path, requestBody, queryString, module } = requestData;

    if (!path || !internalApi[module].baseURL) {
        throw { errorCode: "INVALID.API.404" };
    }

    const requestURI = internalApi[module].baseURL + path;

    const options = {
        requestMethod,
        requestHeaders: {
            ...requestHeaders,
            ...internalApi[module].headers,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        requestURI,
        requestBody,
        queryString
    };

    try {
        stringifyLog(options);
        const response = await thirdPartyApiCall(options);
        const { success } = response.data;

        if (success) {
            return {
                statusCode: response.status,
                body: response.data
            };
        }

        throw {
            data: response,
            errorCode: "BR.INTERNAL.400"
        };
    } catch (error) {
        log.error(functionName, 'error in request', error);
        let errorData;
        let message = 'Unable to fetch data, please try again later!';

        if (error.response) {
            errorData = error.response.data;
        }

        if (errorData?.message || errorData?.msg) {
            message = errorData.message || errorData.msg;
        }

        throw {
            message,
            data: typeof errorData === 'object' ? errorData : {},
            errorCode: "BR.INTERNAL.400"
        };
    }
};

const stringifyLog = (data) => {
    const functionName = "internalRequestCall";
    try {
        log.info(functionName, 'internal request call data', JSON.stringify(data));
    } catch (error) {
        log.info(functionName, 'internal request call data', data);
    }
};

module.exports = internalRequestCall;