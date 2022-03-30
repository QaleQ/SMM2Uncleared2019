const queryDB = require('../utils/queryDb');
const Level = require("./level");

class Cache {
  constructor(hash) {
    this.hash = hash;
    this.levels = [];
  }
  updateHash() {
    this.levels = [];
    this.hash += 1;
  }
  async setLevels(array = null) {
    this.levels = [];
    if (array === null) {
      let sql = `SELECT * FROM levels LIMIT 10;`;
      let sqlResult = await queryDB(sql);
      this.setLevels(sqlResult)
    } else {
      array.forEach(level => {
        this.levels.push(new Level(level));
      })
    }
  }
}

module.exports = Cache;



