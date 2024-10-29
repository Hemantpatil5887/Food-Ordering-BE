const { constants } = require('./environmentFiles');
const { CLIENTS_WITH_COUNTRY_CODE } = constants;
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger('update-client-creds');
const integrationClients = require('../../dal/integrationClients');
const dbHelpers = require('../../dal/dbHelpers');
const { httpContext } = require('./requireHelper');

const updateClientCreds = async ({ paramName, newParamValue, clientID, clientName }) => {
    const functionName = "updateClientCreds";
    const countryCode = httpContext.get('CountryCode');

    await updateSQL({ paramName, newParamValue, clientID, countryCode });
    log.info(functionName, 'updated integration client creds in mysql');

    await updateRedis({ paramName, newParamValue, clientName, countryCode });
    log.info(functionName, 'updated integration client creds in redis');

    return;
};

const updateRedis = async (data) => {
    const functionName = "updateRedis";
    const { paramName, newParamValue, clientName, countryCode } = data;
    let keyName = `integration:getClientCreds_${clientName}`;

    if (countryCode && CLIENTS_WITH_COUNTRY_CODE[clientName]) {
        keyName += `_${countryCode}`;
    }

    log.info(functionName, 'updating integration client creds in redis', keyName, data);

    const redisData = await dbHelpers.getKey(keyName);
    const keyIndex = redisData.findIndex((value) => value.ParamName === paramName && value.ClientName === clientName);

    if (keyIndex > -1) {
        redisData[keyIndex].ParamValue = newParamValue;
        await dbHelpers.setKey(keyName, redisData);
    }
    return;
};

const updateSQL = async (data) => {
    const functionName = "updateSQL";
    log.info(functionName, 'updating integration client creds in mysql', data);
    await integrationClients.updateClientDetailsWithCredsByParamName(data);
    return;
};

module.exports = updateClientCreds;