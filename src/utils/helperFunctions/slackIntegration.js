const slackHook = require('../requestHelper/slackHook');
const { env, httpContext } = require('./requireHelper');

const slackIntegration = async (url, error) => {
    const countryCode = httpContext.get('CountryCode');
    const request = httpContext.get("clientRequest")?.request || {};

    const object = {
        slackHook: url,
        body: 'Environment is `' + env + '`. '
        + 'API name is `' + httpContext.get('ApiName') + '`. '
        + 'Country is `' + countryCode + '`. '
        + 'ApiHash is `' + httpContext.get('ApiHash') + '`. \n'
        + 'Failed with following error:'
        + '```' + JSON.stringify(error) + '```'
        + '\n Following was the request object:'
        + '```' + JSON.stringify(request) + '``` '
    };
    await slackHook(object);
};

module.exports = slackIntegration;