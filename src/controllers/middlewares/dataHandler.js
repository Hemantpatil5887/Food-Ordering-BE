const {
    createBunyanLogger
} = require('../../utils');
const log = createBunyanLogger('dataHandler');

module.exports = async (request, response, next) => {
    const functionName = "request-data-handler";
    next();
};
