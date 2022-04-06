// ensureCache
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
  next();
}

function filteredCache(cache) {
  return cache.filter(level => {
    return !serverCache.clearedLevels.has(level.id)
  });
}

// readFlash
function readFlash(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
}

// authStatus
function authStatus(req, res, next) {
  res.locals.userID = req.session.userID;
  res.locals.username = req.session.username;
  next();
}

module.exports = {
  ensureCache,
  readFlash,
  authStatus
}
