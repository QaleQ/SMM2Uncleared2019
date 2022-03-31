const queryDB = require("../utils/queryDb");
const Level = require('../models/Level');

class ServerCache {

  constructor() {
    this.levelCache = {};
    this.recentlyCleared = new Set();
    this.hash = Math.floor(Math.random() * 10000000)
  }

  updateHash() {
    this.hash += 1;
  }

  get numLevels() {
    return Object.values(this.levelCache).length;
  }

  async updateLevelCache(levelArray = null) {
    if (levelArray == null) {
      let sql = `SELECT * FROM levels WHERE ISNULL(cleared_by) ORDER BY date_datetime LIMIT 10;`;
      let { sqlResult } = await queryDB(sql);
      this.updateLevelCache(sqlResult);
      return;
    }
    for (let level of levelArray) {
      this.levelCache[level.id] = new Level(level);
    }
  }

}

module.exports = ServerCache;
