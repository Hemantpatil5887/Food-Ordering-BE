'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser');

const { createBunyanLogger, env, constants, moment } = require('./../utils');
const { PROCESS_EXIT_TIME } = constants;
const log = createBunyanLogger('server');
const serverName = process.env.SERVER_NAME || 'FooD Ordering';
const functionName = "server.restart";
const PORT = process.env.PORT;
if (env === 'production') {
    try {
        require('./prodModules');
    } catch (e) {
        log.error('server', 'error in prodModules file', e);
    }
}
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('../controllers/routes/index'));

// finally, let's start our server...
const server = app.listen(PORT, () => {
    log.info(functionName, 'Listening on port ', PORT);
    log.info(functionName, 'server startup log', `server ${serverName} restarted at ${moment().format("YYYY-MM-DD HH:mm:ss")} `);
});


// error handling
process
    .on('unhandledRejection', (err, promise) => {
        log.error("unhandledRejection", "unhandledRejection error", err);
        log.error('unhandledRejection', 'Unhandled rejection', new Error('unhandled rejection at ', promise, `reason: ${err.message}`));
        app.stop = (() => {
            log.error('unhandledRejection', 'server closed', new Error("Http server closed"));
            server.close();
            setTimeout(() => {
                log.error('unhandledRejection', 'process exiting', new Error("exiting process"));
                process.exit(1);
            }, PROCESS_EXIT_TIME);
        });
        app.stop();
    })
    .on('uncaughtException', (err) => {
        log.error('uncaughtException', 'uncaught exception', new Error(`Uncaught Exception: ${err.message}`));
    });


process.on('beforeExit', (code) => {
    // Can make asynchronous calls
    setTimeout(() => {
        log.error(functionName, 'process exit', new Error(`Process will exit with code: ${code}`));
        process.exit(code);
    }, 1000);
});

module.export = server;