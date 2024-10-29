/* jshint node: true */
'use strict';

// packages
const env = process.env.NODE_ENV;
const express = require('express');
const bunyan = require('bunyan');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const httpContext = require('express-http-context');
const mysql = require('mysql');
const util = require('util');
const axios = require('axios');
const http = require('http');
const https = require('https');
const qs = require('qs');
const os = require('os');
const mimeTypes = require('mime-types');
const crypto = require('crypto');
const uuid = require('uuid');

// express
const app = express();
const expressRouter = express.Router();

// direct dependencies
exports._ = _;
exports.app = app;
exports.axios = axios;
exports.bunyan = bunyan;
exports.env = env;
exports.express = express;
exports.expressRouter = expressRouter;
exports.fs = fs;
exports.httpContext = httpContext;
exports.jwt = jwt;
exports.jwksClient = jwksClient;
exports.moment = moment;
exports.path = path;
exports.redis = redis;
exports.mysql = mysql;
exports.util = util;
exports.http = http;
exports.https = https;
exports.qs = qs;
exports.os = os;
exports.mimeTypes = mimeTypes;
exports.crypto = crypto;
exports.uuid = uuid;

