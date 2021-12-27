import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import dbHelper from '../db-helper'
import { SELECT_NAME_BY_TAGS } from '../sql'

export default async ctx => {
  const { theme = 'fill', tags } = ctx.query
  const svgDir = path.resolve(config.svgDir, theme)
  let fileNames = await fs.readdir(svgDir)
  fileNames.sort(function(a, b) {
    return fs.statSync(svgDir + '/' + b).mtime.getTime() - fs.statSync(svgDir + '/' + a).mtime.getTime()
  })

  let tagSet
  if (tags) {
    const params = tags
      .split(',')
      .map(tag => `'${tag}'`)
      .join(',')
    const rows = await dbHelper.all(`${SELECT_NAME_BY_TAGS} (${params})`)
    tagSet = new Set(rows.map(({ name }) => name))
  }

  const names = fileNames
    .filter(fileName => fileName.endsWith('.svg') && (!tagSet || tagSet.has(fileName.split('.')[0])))
    .map(fileName => ({
      name: fileName.split('.')[0],
      label: fileName.split('.')[1]
      // path: `/svgs/${theme}/${fileName}`,
    }))

  ctx.body = names
}
