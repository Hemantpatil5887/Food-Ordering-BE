const {
    createBunyanLogger,
    httpContext,
    uuid
} = require('../../utils');
const log = createBunyanLogger('setContext');

module.exports = async (request, response, next) => {
    const functionName = "request-setContext";
    httpContext.ns.bindEmitter(request);
    httpContext.ns.bindEmitter(response);
    try {
        const rp = request.baseUrl + request.path;
        const apiID = uuid.v4();
        const apiName = rp.toLowerCase();
        httpContext.ns.set('ApiHash', apiID);
        httpContext.ns.set('ApiName', apiName);

    } catch (error) {
        log.error(functionName, 'error in logger', new Error(error));
        log.error(functionName, 'error in logger', 'Error in setting ApiHash or stringifying the request payload', new Error("Error in setting ApiHash or stringifying the request payload"));
    }
    log.info(functionName, 'request details', {
        requestPath: request.path,
        body: JSON.stringify(request.body),
        headers: request.headers,
        queryParams: request.query
    });
    next();
};
