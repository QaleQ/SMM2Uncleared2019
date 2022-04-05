const serverCache = require("../config/caches");
async function ensureCache (req, res, next) {
  // disable on root path to prevent unnecessary double call when redirected.
  if (req.originalUrl === '/') return next();
  let { hash, levelCache } = req.session;

  if (!serverCache.initialized) await serverCache.updateLevelCache();

  if (serverCache.matchHash(hash)) return next();

  if (!levelCache) levelCache = serverCache.cacheCopy();
  else levelCache = filteredCache(levelCache);

  req.session.levelCache = levelCache;
  req.session.hash = serverCache.hash;
  return next();
}

module.exports = ensureCache;


function filteredCache(cache) {
  let newCache = Object.assign({}, cache); // because mutating makes me uncomfortable
  serverCache.clearedLevels.forEach(entry => {
    delete newCache[entry];
  })
  return newCache;
}
