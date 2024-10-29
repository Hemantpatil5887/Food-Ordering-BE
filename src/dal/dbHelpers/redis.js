const { util, redis } = require('../../utils/helperFunctions/requireHelper');
const { promisify } = util;

// redis connection
let redisClient;
const { dataSource } = require('../../utils/helperFunctions/environmentFiles');
const redisConfig = dataSource.redis;
try {
    redisClient = redis.createClient(redisConfig);
} catch (error) {
    throw new Error(error);
}


const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);
const persistAsync = promisify(redisClient.persist).bind(redisClient);
const deleteAsync = promisify(redisClient.del).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);

const getKey = async (key) => {

    let result;
    try {
        result = await getAsync(key);
        return JSON.parse(result);
    } catch (e) {
        return result;
    }
};

const setKey = async (key, value, ttl = -1) => {

    try {
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        await setAsync(key, value);
        let expireResult;
        if (ttl === -1) {
            expireResult = await persistAsync(key);
        } else {
            expireResult = await expireAsync(key, ttl);
        }
        return expireResult;
    } catch (e) {
        throw new Error(e);
    }
};

const expireKey = async (key) => {
    try {
        const result = await expireAsync(key, 0);
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

const deleteKey = async (key) => {
    try {
        const result = await deleteAsync(key);
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

const keys = async (key) => {
    return await keysAsync(key);
};

module.exports = {
    getKey,
    setKey,
    expireKey,
    deleteKey,
    keys
};