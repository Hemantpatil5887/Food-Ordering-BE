const { createBunyanLogger, _ } = require('./../../utils');
const { getUser } = require('./../../dal')
const log = createBunyanLogger('apple.querySale');

const details = async (data) => {
    const functionName = 'details';
    const whereCondition = {};
    if (data.email) {
        whereCondition.email = data.email
    }

    if (data.phone) {
        whereCondition.phone_number = data.phone
    }

    const user = await getUser(whereCondition, 'username, email, phone_number, address, last_login');
    log.info(functionName, 'user datails', user)
    if (!_.isEmpty(user)) {
        return {
            data: user[0]
        }
    }
    throw {
        errorCode: "BR.INVALID.DATA.400",
        message: "user not found",
        data: {}
    }
};

module.exports = details;