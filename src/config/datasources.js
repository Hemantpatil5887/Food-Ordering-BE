module.exports = {
    "db": {
        "name": "db",
        "connector": "memory"
    },
    "mysql": {
        "host": process.env.DB_HOST,
        "port": process.env.mysqlPort,
        "database": process.env.DATABASE,
        "password": process.env.DB_PASSWORD,
        "name": "mysql",
        "user": process.env.DB_USERNAME,
        "connector": "mysql",
        "connectTimeout": parseInt(process.env.mysqlConnectTimeout),
        "acquireTimeout": parseInt(process.env.mysqlAcquireTimeout)
    }
};