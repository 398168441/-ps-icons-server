import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import BusinessError, {errors} from '../business-error'



export default async (ctx) => {
    const {list = [], theme = 'fill'} = ctx.request.body;

    const fileNames = await fs.readdir(path.resolve(config.svgDir, theme))
    const existFiles = []
    list.forEach(name => {
        const fileName = fileNames.find(fileName => fileName.endsWith(`.${name}.svg`))
        if (fileName) {
            existFiles.push(name)
        }
    })
    if (existFiles.length > 0) {
        throw new BusinessError(errors.FILE_ALREADY_EXIST, `以下图标已存在：${existFiles.join(',')}`)
    }
    ctx.body = 'success';
}
