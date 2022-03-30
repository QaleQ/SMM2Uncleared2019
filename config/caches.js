const Cache = require('../models/cache');

const serverCache = new Cache(Math.floor(Math.random() * 1000000000));
const userCaches = {}

module.exports = { serverCache, userCaches }

