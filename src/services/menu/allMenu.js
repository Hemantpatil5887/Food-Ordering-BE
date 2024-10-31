const { createBunyanLogger, _ } = require('./../../utils');
const { allMenus } = require('./../../dal')
const log = createBunyanLogger('allMenu');

const allMenu = async (data) => {
    const functionName = 'allMenu';
    const whereCondition = {};
    if(data.name){
        whereCondition.name = data.name;
    }
    if(data.type) {
        whereCondition.type = data.type;
    }
    const menu = await allMenus(whereCondition,'item_id, restaurant_id, name, description, price, available, image_url, type');
    log.info(functionName, 'all menu', menu)
    if (!_.isEmpty(menu)) {
        return {
            data: menu
        }
    }
    throw {
        errorCode: "BR.INVALID.DATA.400",
        message: "unable to fetch menu",
        data: {}
    }
};

module.exports = allMenu;