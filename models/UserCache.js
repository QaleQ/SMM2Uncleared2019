const queryDB = require("../utils/queryDb");
const serverCache = reqiore('./ServerCache');

class UserCache {
  constructor(hash) {
    this.levelCache = {};
    this.completedLevels = {};
    this.hash = hash;
  }
  compareHash() {
    if (this.hash === serverCache.hash) return;
    for (let id of serverCache.recentlyCleared) {
      if (this.levelCache[id]) delete this.levelCache[id];
    }
    this.hash = serverCache.hash;
  }
  async completeLevel(id, userID) {
    let sql = `UPDATE levels SET cleared_by=:cleared_by, cleared_at=NOW() WHERE id=:id;`;
    await queryDB(sql, {id, userID});
      // if 2 ppl complete smae level at same time, this will throw error

    this.completedLevels[id] = this.levelCache[id];
    delete this.levelCache[id];
    serverCache.recentlyCleared.add(id);
    serverCache.updateHash();
    this.compareHash();
  }
  uncompleteLevel(id) {
    let sql = `UPDATE levels SET cleared_by=NULL, cleared_at=NULL WHERE id=:id;`;
    await queryDB(sql, {id, userID});
    delete this.completedLevels[id];
    serverCache.recentlyCleared.delete(id);
  }
}
