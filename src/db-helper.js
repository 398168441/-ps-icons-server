import path from 'path'
import sqlite3 from 'sqlite3'
import config from './config'
import logger from './utils/logger'
import { CREATE_NAME_TAG_SQL } from './sql'

class DbHelper {
  constructor(dbName) {
    this.db = new sqlite3.Database(path.resolve(config.svgDir, dbName), err => {
      if (err) {
        logger.error(err)
      } else {
        // init table
        this.db.run(CREATE_NAME_TAG_SQL)
      }
    })
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error(`Error running sql: ${sql}`)
          reject(err)
        } else {
          resolve({ lastID: this.lastID, changes: this.changes })
        }
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          logger.error(`Error running sql: ${sql}`)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error(`Error running sql: ${sql}`)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}

export default new DbHelper('cps-svg.sqlite3')
