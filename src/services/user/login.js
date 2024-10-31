const { createBunyanLogger, _, jwt } = require('./../../utils');
const { getUser } = require('./../../dal')
const log = createBunyanLogger('login');

const login = async (data) => {
    const functionName = 'login';
    const whereCondition = {};
    if (data.userName) {
        whereCondition.email = data.userName
    }

    if (data.password) {
        whereCondition.password_hash = data.password
    }

    const [user] = await getUser(whereCondition, 'user_id, username, email, phone_number, address, last_login');
    log.info(functionName, 'user datails', user)
    if (!_.isEmpty(user)) {
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET_KEY);
        return {
            data: {
                token
            }
        }
    }
    throw {
        errorCode: "BR.INVALID.DATA.400",
        message: "user not found",
        data: {}
    }
};

module.exports = login;