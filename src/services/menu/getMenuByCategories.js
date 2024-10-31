const { createBunyanLogger, _ } = require('./../../utils');
const { getMenuByCategoriesList } = require('./../../dal')
const log = createBunyanLogger('allMenu');

const getMenuByCategories = async (data) => {
    const functionName = 'getMenuByCategories';
    const { type } = data;
    if (!type || _.isEmpty(type)) {
        throw {
            errorCode: "BR.INVALID.DATA.400",
            message: "Invalid types of category",
            data: {}
        }
    }
    const menu = await getMenuByCategoriesList({ type }, 'name, description, price, available, image_url, type');
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

module.exports = getMenuByCategories;