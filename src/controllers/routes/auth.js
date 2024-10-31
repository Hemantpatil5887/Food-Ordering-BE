const { user } = require('../../services');
const { express, createBunyanLogger, customCatchError, sendFormattedResponse } = require('../../utils');
const log = createBunyanLogger('login-routes');
const router = express.Router();

router.route('/success').get(async (request, response) => {
    
    if (request.user) {
        const { username } = request.user;
        const responseObject = {
            success: true,
            message: "user has successfully authenticated",
            data: {
                DisplayName: username
            }
        };
        response.status(200).send(responseObject);
    } else {
        response.status(401).send({
            success: false,
            message: "user has not logged in"
        });
    }
});


module.exports = router;