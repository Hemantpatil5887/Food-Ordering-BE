const { _, httpContext, moment } = require('./../helperFunctions/requireHelper');
const validationConfig = require('../../config/validation');
const { constants } = require('../helperFunctions/environmentFiles');
const { CLIENTS_WITH_COUNTRY_CODE } = constants;
const validatorFunctions = {
    presence: function (data, keys) {
        /*
            Returns missing keys from a set of data.
            Nested keys can be checked too.
            Ex. To check for 'b' in {a: {b: '1'}} the key will be 'a.b' or ['a','b']
         */
        const missingKeys = [];

        _(keys).forEach((key) => {
            if ((_.isString(_.get(data, key)) && !_.get(data, key)) || !_.has(data, key) || _.get(data, key) == null) {
                missingKeys.push(key);
            }


        });

        return missingKeys;
    },
    inArray: function (value, checkIn) {
        /*
            Returns a boolean based on the presence of given value in the array
         */
        let boo = false;
        if (checkIn.indexOf(value) > -1) {
            boo = true;
        }
        return boo;
    },
    minimumAllowedLength: function (value, minLength) {
        /*
            Returns a boolean based on length of the array
         */
        return (value ? _.gte(value.length, minLength) : false);
    },
    maximumAllowedLength: function (value, maxLength) {
        /*
            Returns a boolean based on the length of the array
         */
        return (value ? _.lte(value.length, maxLength) : false);
    },
    isNumber: _.isNumber,
    isString: _.isString,
    isArray: _.isArray,
    isBoolean: _.isBoolean,
    isPlainObject: _.isPlainObject,
    isDateValid: function (value, parsingOptions) {
        /*
            Returns boolean based a valid Date String is provided
        */
        if (parsingOptions && !_.isArray(parsingOptions)) {
            return false;
        }
        const d = parsingOptions ? moment(value, parsingOptions) : moment(value);
        return d.isValid();
    },
    trimAll: function (T, modifier) {
        const self = this;
        if (_.isArray(T)) {
            // For all String values in an array
            const arr = [];
            _.forEach(T, (item) => {
                arr.push(self.trimAll(item, modifier));
            });
            return arr;
        } else if (_.isObject(T)) {
            // For all string values in an Object
            _.forEach(T, (value, key) => {
                T[key] = self.trimAll(value, modifier);
            });
            return T;
        } else if (_.isString(T)) {
            let value = 'default';
            if (modifier) {
                value = _.trim(T, modifier);
            } else {
                value = _.trim(T);
            }
            return value;
        } else {
            return T;
        }
    },
    atleastOnePresent: function (data, keys) {
        /*
            Returns a boolean if atleast one key is present in data
         */
        return keys.some((key) => _.get(data, key) !== undefined);
    },
    checkString: (value) => {
        return _.isString(value);
    },
    checkNumber: (value) => {
        return _.isNumber(value);
    },
    checkExactLength: (value, length) => {
        return typeof value === "string" && value.trim().length === length;
    }
};
const hasSufficientParameters = (data) => {
    const { requestBody, countryCode } = data;
    const apiName = data.apiName || httpContext.get("ApiName");
    const clientName = httpContext.get("ClientName") || data.ClientID; // added or condition for unit testing
    let clientFile = countryCode && CLIENTS_WITH_COUNTRY_CODE[clientName] ? clientName + '_' + countryCode : clientName;
    clientFile = clientFile.toUpperCase();
    const checks = validationConfig[clientFile] ? validationConfig[clientFile][apiName] : '';
    if (!checks) {
        // If the validation config is missing or not required to validate request body
        return {
            success: true
        };
    }
    if (!requestBody) {
        return {
            message: 'Insufficient parameteres',
            success: false,
            data: requestBody
        };
    }

    let missingKeys = [];
    const unexpectedValues = [];
    const invalidValues = [];
    let validKeys = [];
    const individualErrors = [];

    _(checks).forEach((check) => {
        if (check.type === 'presence') {
            missingKeys = _.concat(missingKeys, validatorFunctions.presence(requestBody, check.keys));
            if (missingKeys.length) {
                return false;
            }
        } else if (check.type === 'atleastOnePresent') {
            if (!validatorFunctions.atleastOnePresent(requestBody, check.keys)) {
                validKeys = _.concat(validKeys, check.keys);
                if (validKeys.length) {
                    return false;
                }
            }
        } else if (check.type === 'isObjectValueCheck') {
            const value = _.get(requestBody[check.key], check.chilidKey.key); // Gets the value at a specific path
            if (!value && check.chilidKey.type === 'presence') {
                missingKeys.push(check.chilidKey.key);
                if (missingKeys.length) {
                    return false;
                }
            } else if (value && !(validatorFunctions[check.chilidKey.type](value, check.against))) {
                unexpectedValues.push(check.chilidKey.key);
                if (unexpectedValues.length) {
                    return false;
                }
            }
        } else if (check.type === 'isArrayObjectValueCheck') {
            const arrayObjectKey = _.get(requestBody, check.key);
            _.map(arrayObjectKey, (item, index) => {
                if (check.chilidKey.key) {
                    const value = _.get(item, check.chilidKey.key);
                    if (!value && check.chilidKey.type === 'presence') {
                        missingKeys.push(check.key + "[]." + check.chilidKey.key);
                        if (missingKeys.length) {
                            return false;
                        }
                    } else if (value && !(validatorFunctions[check.chilidKey.type](value, check.against))) {
                        unexpectedValues.push(check.key + "[]." + check.chilidKey.key);
                        if (unexpectedValues.length) {
                            return false;
                        }
                    }
                }
                if (check.chilidKey.keys) {
                    const childKeys = check.chilidKey.keys;
                    _.map(childKeys, (childKey) => {
                        const childValue = _.get(item, childKey);
                        if (!childValue && check.chilidKey.type === 'presence') {
                            missingKeys.push(check.key + "[" + index + "]." + childKey);
                        }
                    });
                    if (missingKeys.length) {
                        return false;
                    }
                }
            });
        } else if (check.type === 'custom') {
            check.rules.map((rule) => {
                if (!rule.isValid(data, check.key)) {
                    individualErrors.push(rule.getErrorMsg(check.key));
                }
            });
        } else if (check.type === 'checkString') {
            const value = _.get(requestBody, check.key);
            if (!(validatorFunctions.checkString(value))) {
                unexpectedValues.push(check.key);
                if (unexpectedValues.length) {
                    return false;
                }
            }
        } else if (check.type === 'checkNumber') {
            const value = _.get(requestBody, check.key);
            if (!(validatorFunctions.checkNumber(value))) {
                unexpectedValues.push(check.key);
                if (unexpectedValues.length) {
                    return false;
                }
            }
        } else {
            const value = _.get(requestBody, check.key); // Gets the value at a specific path
            if (value && !(validatorFunctions[check.type](value, check.against))) {
                unexpectedValues.push(check.key);
                if (unexpectedValues.length) {
                    return false;
                }
            }
        }
    });


    if ((missingKeys.length > 0) || (unexpectedValues.length > 0) || (invalidValues.length > 0) || (individualErrors.length > 0)) {
        return {
            message: 'Insufficient parameteres',
            success: false,
            data: {
                missingKeys,
                unexpectedValues: _.pull(unexpectedValues, missingKeys),
                invalidValues,
                validKeys,
                individualErrors
            }
        };
    } else if (validKeys.length > 0) {
        return {
            message: 'Insufficient parameteres',
            success: false,
            data: {
                validKeys
            }
        };
    } else {
        return {
            success: true,
            message: 'Expected keys and values are present',
            data: {}
        };
    }
};

module.exports = {
    validatorFunctions,
    hasSufficientParameters
};