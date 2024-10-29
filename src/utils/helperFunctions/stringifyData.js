const stringifyData = (data) => {
    let finalData = data;
    try {
        finalData = JSON.stringify(data);
    } catch (error) {
        finalData = data;
    }
    return finalData;
};

module.exports = stringifyData;