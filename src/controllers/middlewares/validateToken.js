const { createBunyanLogger, jwt } = require('../../utils');
const log = createBunyanLogger('validateToken');
module.exports = (request, response, next) => {
    const functionName = "validateToken";
    try {
        const { food } = request.cookies;
        const decodedToken = jwt.verify(food, process.env.JWT_SECRET_KEY);
        request.user = decodedToken;
        next();
    } catch (error) {
        log.error(functionName,'error in JWT decode', error);
        response.status(401).send({
            message: "You are not authorised",
            errorCode: "UNAUTHORIZED.401"
        });
    }
};