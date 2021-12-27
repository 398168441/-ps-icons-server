import path, { parse } from 'path'
import fs from 'fs-extra'
import config from '../config'
import logger from './logger'

let usedIconSet = new Set()
try {
    const data = fs.readFileSync(path.resolve(config.svgDir, 'used-icons.json'), 'utf-8')
    usedIconSet = new Set(JSON.parse(data))
    JSON.parse(data)
} catch (error) {
    logger.info(`init used icon failed`)
}

export const isUsed = name => usedIconSet.has(name)

export const addUsed = name => {
    if (!usedIconSet.has(name)) {
        usedIconSet.add(name)
        try {
            fs.writeFileSync(path.resolve(config.svgDir, 'used-icons.json'), JSON.stringify([...usedIconSet]))
        } catch (error) {
            logger.error(`add used icon failed`)
            logger.error(error)
        }
    }
}
