const { userCaches, serverCache } = require("../config/caches");
const Level = require("../models/Level");
const UserCache = require('../models/UserCache');

async function ensureCache (req, res, next) {
  if (userCaches[req.sessionID]) {
    userCaches[req.sessionID].compareHash();
    return next();
  } 
  userCaches[req.sessionID] = new UserCache(serverCache.hash)
  if (!serverCache.numLevels) await serverCache.updateLevelCache();  
  for (const level of Object.values(serverCache.levelCache)) {
    userCaches[req.sessionID].levelCache[level.id] = new Level(level);
  }
  return next();
}

module.exports = ensureCache;
