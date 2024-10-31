const { read, create } = require('./dbHelpers');
const tableName = 'users';

const getUser = async (whereCondition = {}, columns = "*") => {
    const result = await read(tableName, columns, whereCondition);
    return result;
};

const addUser = async (data) => {
    try {
        return await create(tableName, data);
    } catch (error) {
        throw new databaseError(error);
    }
};

module.exports = {
    getUser,
    addUser
};