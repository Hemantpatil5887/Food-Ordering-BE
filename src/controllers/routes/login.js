const { user } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('login-routes');
const router = express.Router();

router.route('/login').post(async (request, response) => {
    const functionName = 'login';
    try {
        const login = await user.login(request.body);
        const formattedResponse = await sendFormattedResponse(login);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});


module.exports = router;