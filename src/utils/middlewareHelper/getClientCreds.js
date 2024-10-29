const { getClientDetailsWithCreds } = require('../../dal');
const createBunyanLogger = require('./../helperFunctions/createBunyanLogger');
const { aesDecryption } = require('./../helperFunctions/aesEncryption');
const log = createBunyanLogger('getClientCreds');
const getClientCreds = async (clientName, countryCode) => {
    const functionName = 'getClientCreds';
    log.info(functionName, 'client details', { clientName, countryCode });
    const creds = await getClientDetailsWithCreds(clientName, countryCode);
    creds.map((item) => {
        if (item.ParamValue && item.ParamValue.includes("ENC_")) {
            const encryptedValue = item.ParamValue.split("ENC_")[1];
            const decryptedValue = aesDecryption(encryptedValue, process.env.secret, process.env.iv);
            item.ParamValue = decryptedValue;
        }
    });
    return creds;
};

module.exports = getClientCreds;