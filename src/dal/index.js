const { getUser, addUser } = require('./user');
const { allMenus, getMenuByCategoriesList } = require('./menu');
const { addOrders, addOrderItem } = require('./order');

module.exports = {
    getUser,
    addUser,
    allMenus,
    getMenuByCategoriesList,
    addOrders,
    addOrderItem
};