const serverCache = require("../config/serverCache");
const queryDB = require("./queryDb");

async function clearLevel(levelID, session, clear = true) {
  let { levelCache, clears, userID } = session;
  
  // validate data
  if (!userID) throw new Error('You need to be logged in to do this');
  if (!/^[0-9]+$/.test(levelID)) throw new Error('Invalid level id')

  // update database
  let sqlClear = `UPDATE levels SET cleared_by = :userID, cleared_at = NOW() WHERE id = :levelID;`;
  let sqlUnclear = `UPDATE levels SET cleared_by = NULL, cleared_at = NULL WHERE id = :levelID;`;
  await queryDB(clear ? sqlClear : sqlUnclear, { levelID, userID });

  // update server cache
  if (clear) {
    serverCache.levelCache = serverCache.levelCache.filter(level => level.id != levelID);
    serverCache.clearedLevels.add(levelID)
  } else {
    serverCache.clearedLevels.delete(levelID)
  }
  serverCache.updateHash();

  // update user session
  let fromArr = clear ? [...levelCache] : [...clears];
  let toArr = clear ? [...clears] : [...levelCache];

  fromArr = fromArr.filter(level => {
    if (level.id == levelID) {
      toArr.push(level);
      return false;
    }
    return true;
  })
  
  session.levelCache = clear ? fromArr : toArr;
  session.clears = clear ? toArr : fromArr;
  return session;
}

module.exports = clearLevel;
