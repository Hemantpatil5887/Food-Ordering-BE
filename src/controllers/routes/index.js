const { app, httpContext, express } = require('../../utils');

// Middlewares
const { setContext, validation,  dataHandler} = require('./../middlewares');

app.use(httpContext.middleware);

app.get('/healthCheck', (request, response) => {
    response.status(200).send('OK');
});

app.use('/', setContext, dataHandler, validation);

app.use('/User', require('./user'));

app.use((request, response) => {
    response.status(404).send({ message: "Invalid API name", data: {} });
});


module.exports = app;