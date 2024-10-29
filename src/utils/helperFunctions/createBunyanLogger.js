const bunyan = require('bunyan');
const httpContext = require('express-http-context');
const _ = require('lodash');

const createBunyanLogger = (loggerName, skipContext) => {

    const bunyanConfig = {
        name: loggerName
    };

    const logger = bunyan.createLogger(bunyanConfig);

    const constructLog = (level) => {
        return (functionName, action, ...args) => {
            try {
                let loggerLevel = level;
                let errorType = "NA";
                if (level === 'error') {
                    if (args[0] instanceof Error) {
                        errorType = 'tech';
                    } else {
                        errorType = 'business';
                    }
                }

                let requestDetails = {};
                if (level === 'request') {
                    requestDetails = {
                        upstreamRequest: args[0].upstreamRequest,
                        clientRequest: args[0].clientRequest,
                        clientResponse: args[0].clientResponse,
                        clientStatus: args[0].clientStatus,
                        upstreamResponse: args[0].upstreamResponse
                    };
                    args.splice(0, 1);
                    loggerLevel = 'info';
                }

                logger[loggerLevel]({
                    apiHash: skipContext ? '' : httpContext.get('ApiHash'),
                    clientName: skipContext ? '' : httpContext.get('ClientName'),
                    apiName: skipContext ? '' : httpContext.get('ApiName'),
                    localHash: skipContext ? '' : httpContext.get('LocalHash'),
                    logType: loggerLevel,
                    functionName,
                    action,
                    errorType,
                    ...requestDetails
                }, ...args);

            } catch (error) {
                logger.error('Error in fetching Api Hash');
                logger.error(error);
                logger[level](...args);
            }
        };
    };

    const logObj = {
        info: constructLog('info'),
        error: constructLog('error'),
        request: constructLog('request'),
        redact: constructLog('redact'),
    };

    return logObj;

};

module.exports = createBunyanLogger;
