class Level {
  constructor(levelObject) {
    this.name = levelObject.name;
    this.description = levelObject.description;
    this.id = levelObject.id;
    this.attempts = levelObject.attempts;
    this.footprints = levelObject.foorprints;
    this.date = levelObject.date
    this.upload_time = levelObject.upload_time;
    this.likes = levelObject.likes;
    this.boos = levelObject.boos;
    this.comments = levelObject.comments;
    this.style = levelObject.style;
    this.theme = levelObject.theme;
    this.tag1 = levelObject.tag1;
    this.tag2 = levelObject.tag2;
    this.cleared_at = null;

    
    this.tag2_display = this.tag1 !== this.tag2;
    this.id_string = formatCode(this.id);
    this.upload_time_string = msToTime(levelObject.upload_time);
    this.date_day = levelObject.date.slice(0, 10);
    this.date_time = levelObject.date.slice(11, 16);
  }
}

function formatCode(id) {
  let string = [
    id.slice(0, 3),
    id.slice(3, 6),
    id.slice(6, 9)
  ]
  return string.join('-');
}
function msToTime(rawTime) {
  let minutes = Math.floor(rawTime / 60000);
  rawTime -= minutes * 60000;
  let seconds = Math.floor(rawTime / 1000);
  let ms = rawTime % 1000;
  return `${padDigits(2, minutes)}:${padDigits(2, seconds)}.${padDigits(3, ms)}`;
}
function padDigits(finalLength, value) {
  let str = value.toString();
  for (let i = str.length; i < finalLength; i++) {
    str = "0" + str;
  }
  return str;
}

module.exports = Level;
