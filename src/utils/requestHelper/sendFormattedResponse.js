const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const log = createBunyanLogger('sendFormattedResponse');

const sendFormattedResponse = async (resultObject) => {
    const response = {
        httpStatus: 200,
        sendResponse: {
            message: "Success",
            data: {},
            errorCode: null
        }
    };

    if (resultObject.message) {
        response.sendResponse.message = resultObject.message;
    }

    if (resultObject.data) {
        response.sendResponse.data = resultObject.data;
    }

    log.info('sendFormattedResponse', "success response sent to downstream", JSON.stringify(response));
    return response;
};

module.exports = sendFormattedResponse;