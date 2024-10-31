const { read, create } = require('./dbHelpers');
const tableName = 'orders';
const orderItemTable = 'order_items';

const addOrders = async (data = {}) => {
    return await create(tableName, data);
};

const addOrderItem =  async (data = {}) => {
    return await create(orderItemTable, data);
};

module.exports = {
    addOrders,
    addOrderItem
};