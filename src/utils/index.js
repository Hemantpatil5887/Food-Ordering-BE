// Helper functions
const createBunyanLogger = require('./helperFunctions/createBunyanLogger');
const environmentFiles = require('./helperFunctions/environmentFiles');
const safePromise = require('./helperFunctions/safePromise');
const errorWrapper = require('./helperFunctions/errorWrapper');
const stringifyData = require('./helperFunctions/stringifyData');
const requireHelper = require('./helperFunctions/requireHelper');

const customCatchError = require('./requestHelper/customCatchError');
const sendFormattedResponse = require('./requestHelper/sendFormattedResponse');

module.exports = {
    ...environmentFiles,
    ...requireHelper,
    createBunyanLogger,
    customCatchError,
    errorWrapper,
    sendFormattedResponse,
    safePromise,
    stringifyData
};