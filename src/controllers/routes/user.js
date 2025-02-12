const { user } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('user-routes');
const router = express.Router();

router.route('/details').post(async (request, response) => {
    const functionName = 'details';
    try {
        const details = await user.details(request.body);
        const formattedResponse = await sendFormattedResponse(details);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});

router.route('/register').post(async (request, response) => {
    const functionName = 'register';
    try {
        const details = await user.register(request.body);
        const formattedResponse = await sendFormattedResponse(details);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});


module.exports = router;