const { menu } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('menu-routes');
const router = express.Router();

router.route('/all').get(async (request, response) => {
    const functionName = 'allMenu';
    try {
        const queryParams = request.query;
        const details = await menu.allMenu(queryParams);
        const formattedResponse = await sendFormattedResponse(details);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});

router.route('/getMenuByCategories').post(async (request, response) => {
    const functionName = 'getMenuByCategories';
    try {
        const details = await menu.getMenuByCategories(request.body);
        const formattedResponse = await sendFormattedResponse(details);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    } catch (error) {
        log.error(functionName, 'error response', error);
        const formattedResponse = await customCatchError(error);
        response.status(formattedResponse.httpStatus).send(formattedResponse.sendResponse);
    }
});


module.exports = router;