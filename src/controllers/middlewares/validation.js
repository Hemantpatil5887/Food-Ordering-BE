const {
    createBunyanLogger
} = require('../../utils');
const log = createBunyanLogger('validation');

module.exports = async (request, response, next) => {
    const functionName = "request-validation";
    next();
};
