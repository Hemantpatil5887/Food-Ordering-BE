const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const { constants } = require('./../helperFunctions/environmentFiles');
const log = createBunyanLogger('customCatchError');
const { RESPONSE_CODE_MAPPING } = constants;
const { httpContext } = require('../helperFunctions/requireHelper');

const customCatchError = async (errorObj, countryCode) => {

    const functionName = 'customCatchError';
    const catchError = {
        httpStatus: 500,
        sendResponse: {
            message: "Something went wrong",
            data: {},
            errorCode: "SM.WTR.500"
        }
    };

    if (!errorObj) {
        errorObj = {};
    }

    if (errorObj.message) catchError.sendResponse.message = errorObj.message;
    if (errorObj.errorCode) catchError.sendResponse.errorCode = errorObj.errorCode;
    if (errorObj.data) catchError.sendResponse.data = errorObj.data;
    
    if (!errorObj.message && errorObj.errorCode && RESPONSE_CODE_MAPPING[errorObj.errorCode]) {
        catchError.sendResponse.message = RESPONSE_CODE_MAPPING[errorObj.errorCode].message;
    }

    if (!errorObj.httpStatus && errorObj.errorCode && RESPONSE_CODE_MAPPING[errorObj.errorCode]) {
        catchError.httpStatus = RESPONSE_CODE_MAPPING[errorObj.errorCode].httpStatus;
    }

    log.info(functionName, "error response sent to downstream", JSON.stringify(catchError));

    return catchError;
};

module.exports = customCatchError;