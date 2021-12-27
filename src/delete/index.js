import path from 'path'
import fs from 'fs-extra'
import {isUsed} from '../utils/used-manager'
import config from '../config'
import BusinessError, {errors} from '../business-error'

export default async (ctx) => {
    const {types = [], theme} = ctx.request.body || {}
    console.log(ctx.request.body)

    const fileNames = await fs.readdir(path.resolve(config.svgDir, theme))
    const usedList = types.filter(type => isUsed(`${theme}.${type}`))
    if (usedList.length > 0) {
        throw new BusinessError(errors.OTHER, `${usedList.join(',')} 已被使用，不能删除`)
    }
    for (let type of types) {
        const fileName = fileNames.find(fileName => fileName.startsWith(`${type}.`))
        fs.unlinkSync(path.resolve(config.svgDir, theme, fileName))
    }
    ctx.body = 'success';
}
