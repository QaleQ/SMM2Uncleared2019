const serverCache = require("../config/caches");
async function ensureCache (req, res, next) {
  let { hash, levelCache } = req.session;

  if (!serverCache.initialized) {
    await serverCache.initLevels();
    serverCache.initialized = true;
  }

  if (serverCache.matchHash(hash)) return next();

  if (!levelCache) levelCache = [...serverCache.levelCache];
  else levelCache = filteredCache(levelCache);
  

  req.session.levelCache = levelCache;
  req.session.hash = serverCache.hash;
  return next();
}

module.exports = ensureCache;


function filteredCache(cache) {
  return cache.filter(level => {
    return !serverCache.clearedLevels.has(level.id)
  });
}
