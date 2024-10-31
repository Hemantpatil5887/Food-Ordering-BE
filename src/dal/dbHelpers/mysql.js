const { dataSource } = require('../../utils/helperFunctions/environmentFiles');

const mysqlConfig = dataSource.mysql;
const {
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection,
    initConnection
} = require('./package');

initConnection(mysqlConfig);

module.exports = {
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection
};