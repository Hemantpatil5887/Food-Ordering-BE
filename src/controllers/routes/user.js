const { user } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('apple-routes');
const router = express.Router();

router.route('/details').post(async (request, response) => {
    const functionName = 'user';
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


module.exports = router;