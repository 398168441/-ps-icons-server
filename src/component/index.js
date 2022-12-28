import path from 'path'
import fs from 'fs-extra'
import svgtojsx from 'svg-to-jsx'
import logger from '../utils/logger'
import { addUsed } from '../utils/used-manager'
import config from '../config'
import BusinessError, { errors } from '../business-error'

export default async ctx => {
  const { type, theme = 'fill', format } = ctx.query
  logger.info(`request ${type}, theme: ${theme}`)

  const fileNames = await fs.readdir(path.resolve(config.svgDir, theme))
  const fileName = fileNames.find(fileName => fileName.startsWith(`${type}.`))
  if (!fileName) {
    logger.error(`${fileName} not exist`)
    throw new BusinessError(errors.FILE_NOT_EXIST, `${type}.svg 不存在`)
  }

  let data = await fs.readFile(path.resolve(config.svgDir, theme, fileName), 'utf8')
  if (format !== 'html') {
    data = await svgtojsx(data)
    // 标识为已使用
    addUsed(`${theme}.${type}`)
  }

  ctx.body = `<i aria-label="图标: ${type}" ${format !== 'html' ? 'className' : 'class'}="ps-icon">${data}</i>`
}
