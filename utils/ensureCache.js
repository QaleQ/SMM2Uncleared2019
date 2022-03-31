const { userCaches, serverCache } = require("../config/caches");
const Cache = require('../models/cache');

async function ensureCache (req, res, next) {
  if (userCaches[req.sessionID]) return next();
  userCaches[req.sessionID] = new Cache(serverCache.hash)
  if (!serverCache.levels.length) await serverCache.setLevels();  
  serverCache.levels.forEach(level => {
    userCaches[req.sessionID].levels.push(level);
  })
  return next();
}

module.exports = ensureCache;
