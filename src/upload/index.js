import path from 'path'
import multer from '@koa/multer'
import _ from 'lodash'
import pinyin from 'pinyin'
import config from '../config'
import BusinessError, { errors } from '../business-error'
import dbHelper from '../db-helper'
import { INSERT_NAME_TAG } from '../sql'
import SvgoStorage from './SvgoStorage'

const svgStorage = new SvgoStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(config.svgDir))
  },
  filename: function(req, file, cb) {
    // 转换为拼音, 再转驼峰并大写首字母(React组件名规范)
    const fieldnamePinyin = pinyin(file.fieldname, { style: pinyin.STYLE_NORMAL }).join('-')
    const saveName = `${_.upperFirst(_.camelCase(fieldnamePinyin))}`
    cb(null, `${saveName}.${file.fieldname}.svg`)
  }
})

export const svgMulter = multer({
  storage: svgStorage,
  limits: { fileSize: config.fileSizeLimit },
  fileFilter: (req, file, cb) =>
    file.mimetype === 'image/svg+xml' ? cb(null, true) : cb(new BusinessError(errors.OTHER, '请上传svg格式文件'))
})

export default async ctx => {
  const nameList = ctx.request.files.map(({ filename }) => filename)
  const { tags } = ctx.request.body
  if (tags) {
    const tagList = tags.split(',')
    for (let name of nameList) {
      for (let tag of tagList) {
        await dbHelper.run(INSERT_NAME_TAG, [name, tag])
      }
    }
  }
  ctx.body = nameList
}
