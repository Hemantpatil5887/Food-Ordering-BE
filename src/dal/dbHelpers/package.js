const mysql = require('mysql');
const util = require('util');

let creds = {
    host: "",
    port: 3306,
    database: "",
    password: "",
    name: "",
    user: "",
    connector: "mysql",
    connectTimeout: 100000,
    acquireTimeout: 50000,
    connectionLimit: 50,
};

const createConfiguration = (mysqlCreds) => {
    creds = { ...mysqlCreds };
    return poolConnection(creds);
};

let con;
let defaultCon;
// node native promisify
const initConnection = (mysqlCreds) => {
    defaultCon = poolConnection(mysqlCreds);
};

const poolConnection = (mysqlCreds) => {
    con = mysql.createPool(mysqlCreds);
    con.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        if (connection) connection.release();
    });
    return con;
};

const getSingleConnection = async (connection = con) => {
    return new Promise((resolve, reject) => {
        connection.getConnection((error, sconnection) => {
            if (error) reject(error);
            resolve(sconnection);
        });
    });
};

// function for fetching the details
const read = async (
    table,
    columns = "*",
    whereData = {},
    orderBy = false,
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        let query = `
            SELECT
                ${columns ? columns : `*`}
            FROM
                ${table} `;
        let whereCondition = " WHERE  1=1";
        if (Object.keys(whereData).length) {
            const keys = Object.keys(whereData);
            keys.map((v) => {
                whereCondition += ` And ${v} = '${whereData[v]}'`;
            });
        }
        query += whereCondition;
        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }
        return await connection.query(query);
    } catch (error) {
        throw new Error(error);
    }
};

// function for updating the table
const update = async (
    table,
    data = {},
    whereData = {},
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    if (Object.keys(whereData).length === 0 || whereData.constructor !== Object) {
        throw new Error("Required where clause for updating the table");
    }

    try {
        let whereCondition = "";
        const keys = Object.keys(whereData);
        keys.map((v, k) => {
            whereCondition += ` ${k === 0 ? "" : " And"} ${v} = '${whereData[v]}'`;
        });

        const query = `
            UPDATE
                ${table}
            SET
                ?
            WHERE
                ${whereCondition}
        `;
        const result = await connection.query(query, [data]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// function for inserting records
const create = async (
    table,
    data = {},
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        const query = `INSERT INTO ${table} SET ?`;
        const result = await connection.query(query, [data]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// for executing any query
const execute = async (
    query,
    data = "",
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        const result = await connection.query(query, data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const startTransaction = async (connection) => {
    try {
        return await connection.beginTransaction();
    } catch (error) {
        throw new Error(error);
    }
};

const rollbackTransaction = async (connection) => {
    try {
        return await connection.rollback();
    } catch (error) {
        throw new Error(error);
    }
};

const commitTransaction = async (connection) => {
    try {
        return await connection.commit();
    } catch (error) {
        throw new Error(error);
    }
};

const releaseSingleConnection = async (connection) => {
    try {
        return await connection.release();
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    createConfiguration,
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection,
    initConnection,
};
