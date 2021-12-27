import Router from '@koa/router'

import dbHelper from '../db-helper'
import logger from '../utils/logger'
import { SELECT_TAGS, SELECT_NAME_BY_TAGS, INSERT_NAME_TAG, DELETE_NAME_TAG } from '../sql'

const router = new Router()

router.get('/icons', async ctx => {
  const { tags = '' } = ctx.query
  const params = tags
    .split(',')
    .map(tag => `'${tag}'`)
    .join(',')
  const rows = await dbHelper.all(`${SELECT_NAME_BY_TAGS} (${params})`)
  ctx.body = rows
})

router.get('/list', async ctx => {
  const { name } = ctx.query
  const sql = name ? `${SELECT_TAGS} WHERE name = '${name}'` : SELECT_TAGS
  const rows = await dbHelper.all(sql)
  ctx.body = rows.map(item => item.tag)
})

router.post('/add', async ctx => {
  const { names = [], tags = [] } = ctx.request.body || {}
  console.log(ctx.request.body)

  for (let name of names) {
    for (let tag of tags) {
      await dbHelper.run(INSERT_NAME_TAG, [name, tag])
    }
  }
  ctx.body = 'success'
})

router.post('/update', async ctx => {
  const { name, tags = [] } = ctx.request.body || {}

  const params = tags.map(tag => `'${tag}'`).join(',')
  await dbHelper.run(`${DELETE_NAME_TAG} (${params})`, [name])

  for (let tag of tags) {
    await dbHelper.run(INSERT_NAME_TAG, [name, tag])
  }
  ctx.body = 'success'
})

export default router
