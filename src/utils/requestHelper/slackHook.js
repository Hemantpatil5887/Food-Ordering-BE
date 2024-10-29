const thirdPartyApiCall = require('./thirdPartyApiCall');
const createBunyanLogger = require('../helperFunctions/createBunyanLogger');
const log = createBunyanLogger('slack.hook');

const slackHook = async (obj) => {
    const functionName = 'slackHook';
    try {
        const options = {
            requestURI: obj.slackHook,
            requestMethod: 'POST',
            requestHeaders: {
                'content-type': 'application/json',
            },
            requestBody: {
                text: obj.body // '```' + JSON.stringify(obj.body) + '```'
            }
        };
        await thirdPartyApiCall(options);
        log.info(functionName, 'posted on slack', obj.body);
        return true;
    } catch (err) {
        log.error(functionName, 'unable to post on slack', err);
        return false;
    }
};

module.exports = slackHook;
