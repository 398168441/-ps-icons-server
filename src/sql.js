// 创建表 nameTags
export const CREATE_NAME_TAG_SQL = `CREATE TABLE IF NOT EXISTS nameTags (
  name TEXT,
  tag TEXT,
  UNIQUE(name,tag))`

// 查询tag列表
export const SELECT_TAGS = `SELECT tag FROM nameTags GROUP BY tag`

// 查询tag下svg名称
export const SELECT_NAME_BY_TAGS = `SELECT name FROM nameTags WHERE tag IN`

// 插入nameTag
export const INSERT_NAME_TAG = `INSERT OR IGNORE INTO nameTags (name, tag) VALUES (?, ?)`

// 删除不在tag下的项
export const DELETE_NAME_TAG = `DELETE FROM nameTags WHERE name = ? AND tag NOT IN`
