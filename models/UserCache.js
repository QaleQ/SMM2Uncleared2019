const queryDB = require("../utils/queryDb");
const { serverCache } = require('../config/caches');
const Level = require('../models/Level');

class UserCache {

  constructor(hash) {
    this.levelCache = {};
    this.completedLevels = {};
    this.hash = hash;
    this.fetchOnce = true;
    // this.loggedIn = false; // make login happen on the usercache instead
  }

  compareHash() {
    if (this.hash === serverCache.hash) return;
    for (let id of serverCache.recentlyCleared) {
      if (this.levelCache[id]) {
        delete this.levelCache[id];
      }
    }
    this.hash = serverCache.hash;
  }

  replaceLevels(levelArray) {
    this.levelCache = {};
    for (let level of levelArray) {
      this.levelCache[level.id] = new Level(level);
    }
  }

  async completeLevel(id, userID) {
    let data = {
      cleared_by: userID,
      id
    }
    let sql = `UPDATE levels SET cleared_by=:cleared_by, cleared_at=NOW() WHERE id=:id;`;
    await queryDB(sql, data);
      // if 2 ppl complete same level at same time, this will throw error

    this.completedLevels[id] = this.levelCache[id];
    this.completedLevels[id].cleared_at = new Date().toISOString();
    delete this.levelCache[id];
    serverCache.recentlyCleared.add(id);
    serverCache.updateHash();
    this.compareHash();
  }

  async uncompleteLevel(id) {
    let sql = `UPDATE levels SET cleared_by=NULL, cleared_at=NULL WHERE id=:id;`;
    await queryDB(sql, { id });
    delete this.completedLevels[id];
    serverCache.recentlyCleared.delete(id);
    serverCache.updateHash();
    this.compareHash();
  }

  async fetchCompleted(userID) {
    // grab userID from req until login happens on class
    if (!this.fetchOnce) return;
    let sql = `SELECT * FROM levels WHERE cleared_by = :userID ORDER BY cleared_at ASC;`;
    let { sqlResult } = await queryDB(sql, { userID });
    for (let level of sqlResult) {
      this.completedLevels[level.id] = new Level(level);
    }
    this.fetchOnce = false;
  }
}

module.exports = UserCache;
