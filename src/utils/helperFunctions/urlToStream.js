const { axios, mimeTypes } = require('./requireHelper');
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger("urlToStream");


const urlToStream = async (url) => {

    try {
        const responseData = await axios.get(url, { responseType: 'stream' });
        const extension = mimeTypes.extension(responseData.headers['content-type']);
        return { file: responseData.data, extension };
    } catch (e) {
        log.error("urlToStream", "image error", e);
        throw {
            errorCode: "BR.INVALID.DATA.400",
            message: "Invalid Image"
        };
    }

};

module.exports = { urlToStream };
