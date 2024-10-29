/* create a global variable

step 1 - when we get the request
    ApiName
    ApiHash
    CountryCode
    ModuleName
    LocalHash
    RequestBody_Prime

step 2 - when calling thirdPartyApis
    From trace-log

step 3 - when responding to the client
    From customCatchError

step 4 - set it to the db */

const { httpContext, _ } = require('../helperFunctions/requireHelper');
const createBunyanLogger = require('../helperFunctions/createBunyanLogger');
const { constants } = require('../helperFunctions/environmentFiles');
const { postTracerInfo, postTracerInputs, postTracerThirdPartyLogs, postTracerResponse } = require('../../dal');
const { maskHeaderObject } = require('./../helperFunctions/hideSensitiveInformation');
const log = createBunyanLogger('tracer-helper');
const { TRACER_REQUEST_CONFIG, TRACER_RESPONSE_CONFIG } = constants;
const keyName = 'tracer';
const stringifyData = require('../helperFunctions/stringifyData');

const createTracerContext = (data) => {
    httpContext.ns.set(keyName, data);
};

const updateTracerContext = (key, value) => {
    const obj = httpContext.get(keyName);
    if (obj) {
        obj[key] = value;
        httpContext.set(keyName, obj);
    }
};

const getTracerContext = () => {
    return httpContext.get(keyName);
};

const updateTraceLogsInDB = (data) => {
    const { endpoint, method, headers, request, response, status } = data;
    const info = getTracerContext();
    if (info) {
        const header = maskHeaderObject(headers);
        const logData = [endpoint, method, stringifyData(header), stringifyData(request), stringifyData(response), status];
        const logs = (info && info.TraceLogs) ? [...info.TraceLogs, logData] : logData;
        updateTracerContext("TraceLogs", logs);
    }
};

const setTracerToDB = async (response) => {
    const functionName = 'setTracerToDB';
    const obj = getTracerContext();
    log.info(functionName, 'tracer context value', stringifyData(obj));
    if (obj && !_.isEmpty(obj)) {
        const ApiName = httpContext.get('ApiName');
        const { ModuleName, RequestBody } = obj;

        // Adds to outgoing_tracer
        const tracerObj = {
            ApiHash: httpContext.get('ApiHash'),
            ApiName,
            CountryCode: httpContext.get('CountryCode'),
            ModuleName,
            RequestBody,
            ResponseBody: stringifyData(response),
        };
        log.info(functionName, 'tracer object', tracerObj);
        const tracerInfo = await postTracerInfo(tracerObj);

        // Adds to outgoing_tracer_inputs
        if (TRACER_REQUEST_CONFIG && TRACER_REQUEST_CONFIG[ApiName]) {
            const arr = [];
            const requestBody = JSON.parse(obj.RequestBody);
            TRACER_REQUEST_CONFIG[ApiName].map((eachAttribute) => {
                const actualValue = _.get(requestBody, eachAttribute);
                if (actualValue) {
                    const val = typeof (actualValue) === 'string'
                        ? actualValue
                        : stringifyData(actualValue);
                    const eachArr = [tracerInfo.insertId, ApiName, eachAttribute, val];
                    arr.push(eachArr);
                }
            });
            if (arr.length) {
                await postTracerInputs(arr);
            }
        }

        // Adds to outgoing_tracer_third_party_logs
        if (obj.TraceLogs && obj.TraceLogs.length) {
            const arr = [];
            obj.TraceLogs.map((eachTrace) => {
                eachTrace.push(tracerInfo.insertId);
                arr.push(eachTrace);
            });
            await postTracerThirdPartyLogs(arr);
        }

        // Adds to outgoing_tracer_response
        if (TRACER_RESPONSE_CONFIG && TRACER_RESPONSE_CONFIG[ApiName]) {
            const arr = [];
            TRACER_RESPONSE_CONFIG[ApiName].map((eachAttribute) => {
                const actualValue = _.get(response, eachAttribute);
                if (actualValue) {
                    const val = typeof (actualValue) === 'string'
                        ? actualValue
                        : stringifyData(actualValue);
                    const eachArr = [tracerInfo.insertId, ApiName, eachAttribute, val];
                    arr.push(eachArr);
                }
            });
            if (arr.length) {
                await postTracerResponse(arr);
            }
        }
    }
    return;
};

module.exports = {
    createTracerContext,
    updateTracerContext,
    getTracerContext,
    updateTraceLogsInDB,
    setTracerToDB
};
