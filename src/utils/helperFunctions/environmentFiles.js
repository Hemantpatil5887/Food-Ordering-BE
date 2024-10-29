const { env } = require('./requireHelper');
let constants = require('../../config/constants');
const dataSource = require('../../config/datasources');
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger('environment-file');

if (env) {
    try {
        constants = require('../../config/constants.' + env);
    } catch (e) {
        log.error("require-helper", `environment config not found for ${env}`, new Error(e));
        throw new Error(e);
    }
}


module.exports = {
    constants,
    dataSource,
};
