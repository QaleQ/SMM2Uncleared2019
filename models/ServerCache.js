const queryDB = require("../utils/queryDb");

class ServerCache {
  constructor() {
    this.levelCache = [];
    this.recentlyCleared = new Set();
    this.hash = Math.floor(Math.random() * 10000000)
    this.data = {}; // counts etc go here later
  }
  updateHash() {
    hash += 1;
  }
  completeLevel(id) {
    this.recentlyCleared.add(id);
    for (let i = 0; i < this.levelCache.length; i++) {
      if (this.levelCache[i].id != id) continue;
      this.levelCache.splice(i, 1);
      this.updateLevelCache();
      break;
    }
    this.updateHash();
  }
  uncompleteLevel(id) {
    this.recentlyCleared.delete(id);
    // no need for users to know about this, but the overview numbers will change.. maybe update hash?
  }
  async updateLevelCache(levelArray = null) {
    if (levelArray = null) {
      let sql = `SELECT * FROM levels WHERE ISNULL(cleared_by) ORDER BY date_datetime LIMIT 10;`;
      let sqlResult = await queryDB(sql);
      this.updateLevelCache(sqlResult);
      return;
    }
    for (let level of levelArray) {
      this.levelCache.push(level);
    }
  }
}


