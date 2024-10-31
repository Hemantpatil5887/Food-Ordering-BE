const { carts } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('carts-routes');
const router = express.Router();

router.route('/add').post(async (request, response) => {
    const functionName = 'add';
    try {
        const body = { ...request.body, ...request.user };
        const details = await carts.add(body);
        const formattedResponse = await sendFormattedResponse(details);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});


module.exports = router;