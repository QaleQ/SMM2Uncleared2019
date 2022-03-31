const ServerCache = require('../models/ServerCache');

let serverCache = new ServerCache();
const userCaches = {}

module.exports = { serverCache, userCaches }
