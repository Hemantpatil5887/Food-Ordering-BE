const { read } = require('./dbHelpers');
const tableName = 'users';

const getUser = async (whereCondition = {}, columns = "*") => {
    const result = await read(tableName, columns, whereCondition);
    return result;
};

module.exports = {
    getUser
};