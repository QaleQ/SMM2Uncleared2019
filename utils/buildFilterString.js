const dbConnection = require("../config/dbConnection");

module.exports = function buildFilterString(data) {
  let sql = [`SELECT * FROM levels WHERE ISNULL(cleared_by)`]
  let {
    match_field,
    match_option,
    match_value,
    upload_date_start,
    upload_date_end,
    style,
    theme,
    tag1,
    tag2,
    first_sort,
    sort_order
  } = data;

  if (match_value) {
    let string = `%${match_value}%`;
    if (match_option == 'starts_with') string = string.slice(1)
    else if (match_option == 'ends_with') string = string.slice(0, -1)
    data.match_value = string;
    sql.push(`AND ${dbConnection.escapeId(match_field)} LIKE :match_value`);
  }
  if (upload_date_start != '2019-06-27' || upload_date_end != '2019-12-31')
    sql.push(`AND (date_datetime BETWEEN :upload_date_start AND :upload_date_end)`);
  if (style) sql.push(`AND style=:style`);
  if (theme) sql.push(`AND theme=:theme`);
  if (tag1 || tag2) {
    if (tag1 == 'None') {
      sql.push(`AND ISNULL(tag1)`);
    }
    else if (tag1 && tag2 && tag1 !== tag2) {
      sql.push(`AND (tag1=:tag1 OR tag1=:tag2)`);
      sql.push(`AND (tag2=:tag1 OR tag2=:tag2)`);
    }
    else {
      let tag = tag1.length ? `tag1` : `tag2`;
      sql.push(`AND (tag1=:${tag} OR tag2=:${tag})`)
    }
  }
  let validSortOrders = ['ASC', 'DESC'];
  if (!validSortOrders.includes(sort_order)) throw new Error ('Invalid sort order')
  sql.push(`ORDER BY ${dbConnection.escapeId(first_sort)} ${sort_order} LIMIT 10;`)
  return sql.join('\n');
}
