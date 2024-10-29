const { constants } = require('../helperFunctions/environmentFiles');
const getCacheName = async (functionName, keyName, usebase64) => {
    const setKeyName = keyName;
    if (usebase64) {
        return await constants.CACHE_PREFIX + functionName + "_" + Buffer.from(JSON.stringify(setKeyName)).toString("base64");
    } else {
        return await constants.CACHE_PREFIX + functionName + "_" + setKeyName;
    }
};

module.exports = getCacheName;