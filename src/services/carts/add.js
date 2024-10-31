const { createBunyanLogger, _ } = require('./../../utils');
const { addOrders, addOrderItem } = require('./../../dal')
const log = createBunyanLogger('allMenu');

const add = async (data) => {
    const functionName = 'add';
    const groupByRestaurant = _.groupBy(data.orders, 'restaurant_id');
    const orderObject = [];
    const groupObject = Object.keys(groupByRestaurant)
    groupObject.forEach((item) => {
        let countTotal = 0;
        groupByRestaurant[item].map((objItem) => {
            countTotal = countTotal + objItem.price;
            countTotal = parseFloat(countTotal.toFixed(2));
        });
        orderObject.push({
            user_id: data.user_id,
            restaurant_id: groupByRestaurant[item][0].restaurant_id,
            total: countTotal
        });
    });
    const mappingOfOrderToRestaurant = {};
    for await (const item of orderObject) {
        const orders = await addOrders(item);
        mappingOfOrderToRestaurant[item.restaurant_id] = orders.insertId;
        log.info(functionName,'order added',orders);
    }
    
    const orderItemID = [];
    data.orders.map((item) => {
        orderItemID.push({
            order_id: mappingOfOrderToRestaurant[item.restaurant_id],
            item_id: item.item_id,
            quantity: 1,
            price: item.price,
            user_id: data.user_id,
        })
    });
    
    for await (const item of orderItemID) {
        const orders = await addOrderItem(item);
        log.info(functionName,'order item added',orders);
    }
    

    return {
        data: {},
        message: "order placed successfully"
    }
};

module.exports = add;