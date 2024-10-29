const RESPONSE_CODE_MAPPING = {
    "INVALID.HEADERS.400": {
        httpStatus: 400,
        message: "Invalid request header",
        errorCode: "INVALID.HEADERS.400"
    },
    "UNAUTHORIZED.401": {
        httpStatus: 401,
        message: "You are not authorised",
        errorCode: "UNAUTHORIZED.401"
    },
    "INVALID.JSON.400": {
        httpStatus: 400,
        message: "Invalid JSON",
        errorCode: "INVALID.JSON.400"
    },
    "SM.WTR.500": {
        httpStatus: 500,
        message: "Something went wrong",
        errorCode: "SM.WTR.500"
    },
    "BR.INVALID.DATA.400": {
        httpStatus: 400,
        message: "Invalid request data",
        errorCode: "BR.INVALID.DATA.400"
    },
    "BR.INTERNAL.400": {
        httpStatus: 400,
        message: "Something went wrong",
        errorCode: "BR.INTERNAL.400"
    },
    "INVALID.API.404": {
        httpStatus: 404,
        message: "Invalid API",
        errorCode: "INVALID.API.404"
    }
};

exports.RESPONSE_CODE_MAPPING = RESPONSE_CODE_MAPPING;