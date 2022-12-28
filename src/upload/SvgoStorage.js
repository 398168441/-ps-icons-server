import path from 'path'
import fs from 'fs-extra'
import pinyin from 'pinyin'
import _ from 'lodash'
import SVGO from 'svgo'
import config from '../config'
import options from './options'

fs.ensureDirSync(path.resolve(config.svgDir, 'fill'))
fs.ensureDirSync(path.resolve(config.svgDir, 'native'))

function getSvgoConfig(type, theme) {
  const plugins = [...options.svgo.plugins]
  const svgAttrs = [
    { focusable: false },
    { 'data-icon': type },
    { width: '1em' },
    { height: '1em' },
    { 'aria-hidden': true }
  ]
  if (theme !== 'native') {
    plugins.push({ removeAttrs: { attrs: ['class', 'fill'] } })
    svgAttrs.push({ fill: 'currentColor' })
  }
  plugins.push({
    addAttributesToSVGElement: { attributes: svgAttrs }
  })

  return {
    ...options.svgo,
    plugins
  }
}

class SvgoStorage {
  _handleFile(req, file, cb) {
    // 目录名
    const destination = path.resolve(config.svgDir)

    // 转换为拼音, 再转驼峰并大写首字母(React组件名规范)
    const fieldnamePinyin = pinyin(file.fieldname, { style: pinyin.STYLE_NORMAL }).join('-')
    const type = `${_.upperFirst(_.camelCase(fieldnamePinyin))}`

    let str = ''
    file.stream.on('data', function(data) {
      str += data.toString()
    })
    file.stream.on('error', cb)
    file.stream.on('end', async function() {
      try {
        const svgo = new SVGO(getSvgoConfig(type, req.body.theme || 'fill'))
        const { data: optimizedData } = await svgo.optimize(str)
        const finalPath = path.join(destination, req.body.theme || 'fill', `${type}.${file.fieldname}.svg`)
        await fs.writeFile(finalPath, optimizedData, 'utf8')
        cb(null, {
          destination: destination,
          filename: type,
          path: finalPath,
          size: optimizedData.length
        })
      } catch (error) {
        return cb(error)
      }
    })
  }

  _removeFile(req, file, cb) {
    var path = file.path

    delete file.destination
    delete file.filename
    delete file.path

    fs.unlink(path, cb)
  }
}

export default SvgoStorage
