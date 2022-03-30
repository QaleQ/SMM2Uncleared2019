class Level {
  constructor(levelObject) {
    this.id = levelObject.id;
    this.level_name = levelObject.level_name;
    this.description = levelObject.description;
    this.level_code = levelObject.level_code;
    this.attempts = levelObject.attempts;
    this.upload_date_day = Level.datetimeToDate(levelObject.upload_datetime);
    this.upload_date_time = Level.datetimeToTime(levelObject.upload_datetime);
    this.clear_check_time = Level.clearCheckToTime(levelObject.clear_check_time);
    this.likes = levelObject.likes;
    this.boos = levelObject.boos;
    this.comments = levelObject.comments;
    this.style = levelObject.style;
    this.theme = levelObject.theme;
    this.tag1 = levelObject.tag1;
    this.tag2 = levelObject.tag2 === levelObject.tag1 ? null : levelObject.tag2;
    this.cleared_at;
    this.cleared_by;
  }
  static datetimeToDate(datetime) {
    return 'placeholder'
  }
  static datetimeToTime(datetime) {
    return 'placeholder';
  }
  static clearCheckToTime(rawTime) {
    return 'placeholder';
  }
}

module.exports = Level;
