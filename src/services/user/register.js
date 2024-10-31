const { createBunyanLogger, _ } = require('./../../utils');
const { addUser } = require('./../../dal')
const log = createBunyanLogger('login');

const register = async (data) => {
    const functionName = 'login';
    const userObject = {};
    if (data.address) {
        userObject.address = data.address;
    }

    if (data.email) {
        userObject.email = data.email;
    }
    if (data.name) {
        userObject.username = data.name;
    }

    if (data.password) {
        userObject.password_hash = data.password;
    }

    if (data.phone) {
        userObject.phone_number = data.phone;
    }
    log.info(functionName, 'userObject', userObject);
    const user = await addUser(userObject);
    log.info(functionName, 'user register', user);
    if (!_.isEmpty(user)) {
        return {
            message: "User created successfully",
            data: {}
        }
    }
    throw {
        errorCode: "BR.INVALID.DATA.400",
        message: "user not found",
        data: {}
    }
};

module.exports = register;