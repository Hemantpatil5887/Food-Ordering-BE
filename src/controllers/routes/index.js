const { app, httpContext, cors, cookieParser } = require('../../utils');

// Middlewares
const { setContext, validation,  dataHandler, validateToken } = require('./../middlewares');

app.use(httpContext.middleware);

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    })
);

app.get('/healthCheck', (request, response) => {
    response.status(200).send('OK');
});


app.use('/', setContext, dataHandler, validation);

app.use('/User', require('./user'));

app.use('/Auth/check/', validateToken, require('./auth'));

app.use('/Auth', require('./login'));

app.use('/Menu', require('./menuItem'));

app.use('/Carts', validateToken, require('./carts'));

app.use((request, response) => {
    response.status(404).send({ message: "Invalid API name", data: {} });
});


module.exports = app;