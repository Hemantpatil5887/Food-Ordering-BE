const { updateTraceLogsInDB } = require('../middlewareHelper/tracerHelper');
const { axios, httpContext, _ } = require('../helperFunctions/requireHelper');
const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const { constants } = require('../helperFunctions/environmentFiles');
const log = createBunyanLogger('axios-middleware');

const orgCreate = axios.create;
axios.create = (config) => {
    const result = orgCreate.call(this, config);
    _.forEach((axios.interceptors.request).handlers, (handler) => {
        result.interceptors.request.use(handler.fulfilled, handler.rejected);
    });
    _.forEach((axios.interceptors.response).handlers, (handler) => {
        result.interceptors.response.use(handler.fulfilled, handler.rejected);
    });
    return result;
};

// intercepts all requests
axios.interceptors.request.use((config) => {

    try {
        if (httpContext.get("ApiHash")) {
            config.headers.apiHash = httpContext.get("ApiHash");
        }
        if (config.headers["request-code"] && config.headers["client-id"] === "MEDIAMARKT") {
            config.headers.apiHash = config.headers["request-code"];
        }
        return config;
    } catch (e) {
        log.info('trace-log request utility', 'error', e);
    }
}, (error) => {
    return Promise.reject(error);
});

// intercepts all responses
axios.interceptors.response.use((options) => {
    const traceLogObject = formTraceLogObject(options);
    addTraceInLogs(traceLogObject);
    return options;

}, (error) => {
    // resopnse is not OK 200 and getting HTML error, Connection error, proper response of error
    const options = error.response || error;
    const traceLogObject = formTraceLogObject(options, error);
    addTraceInLogs(traceLogObject);
    return Promise.reject(error);
});

// forms a printable object for trace-log
const formTraceLogObject = ({ data, config = {}, status }, error) => {
    let request;
    if (config && config.data) {
        if (_.isString(config.data)) {
            try {
                request = JSON.parse(config.data);
            } catch (errorOfParsing) {
                request = config.data;
            }
        } else {
            request = config.data;
        }
    } else if (config && config.params) {
        if (_.isString(config.params)) {
            request = JSON.parse(config.params);
        } else {
            request = config.params;
        }
    } else {
        request = '';
    }

    let { url = '' } = config;
    if (config.baseURL) {
        url = config.baseURL + config.url;
    }

    if (_.includes(url, '?')) {
        const queryString = url?.split("?")?.[1];
        request = JSON.parse('{"' + queryString.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            (key, value) => {
                return key === "" ? value : decodeURIComponent(value);
            });
    }

    const traceLogObject = {
        endpoint: url,
        request,
        response: data || error, // If data is undefined in the case of HTML error or connection error
        headers: config ? config.headers : '',
        method: config ? config.method : '',
        module: 'IntegrationAPI',
        status
    };

    if (httpContext.get("ApiHash")
        && !constants?.SKIP_INTERNAL_APIS?.[url]
        && !constants.SKIP_APIS_LOGS?.[httpContext.get('ApiName')]
        && !url.includes("hooks.slack.com")
    ) {
        httpContext.ns.set('clientRequest', {
            request: traceLogObject.request,
            response: getMessage(traceLogObject),
            status: traceLogObject.status || traceLogObject?.response?.code
        });
    }
    return traceLogObject;
};

const getMessage = ({ response, status }) => {
    if (response instanceof Error)
        return response.message;

    if (constants.HTTP_STATUS_MESSAGES[status])
        return constants.HTTP_STATUS_MESSAGES[status];

    return response;
};

// creates a trace-log
const addTraceInLogs = (data) => {
    log.redact('trace-log', 'upstream request', data, true);
    const url = data.endpoint;
    if (!url.includes("hooks.slack.com")) {
        updateTraceLogsInDB(data);
    }
};

module.exports = axios;