// ensureCache
const serverCache = require("../config/serverCache");

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

// passInfo
function passInfo(req, res, next) {
  res.locals.styleImages = {
  'SMB1': 'https://seeklogo.com/images/S/super-mario-bros-logo-B712683EBE-seeklogo.com.png',
  'SMB3': 'https://seeklogo.com/images/S/super-mario-bros-3-logo-3F9AF3A1F1-seeklogo.com.png',
  'SMW': 'https://seeklogo.com/images/S/super-mario-world-logo-CC25D10D3A-seeklogo.com.png',
  'NSMBU': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/NSMBU_2D_Logo.svg',
  'SM3DW': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/Logo_EN_-_Super_Mario_3D_World.png'
  }
  res.locals.path = req.originalUrl;
  res.locals.userID = req.session.userID;
  res.locals.username = req.session.username;
  next();
}

module.exports = {
  ensureCache,
  readFlash,
  passInfo
}
