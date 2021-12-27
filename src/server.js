import Koa from 'koa2'
import Router from '@koa/router'
import bodyparser from 'koa-bodyparser'
import dataWrapper from './data-wrapper'
import genComponent from './component'
import getList from './list'
import upload, { svgMulter } from './upload'
import checkUpload from './upload/check'
import deleteIcons from './delete'
import tag from './tag'

const app = new Koa()
const router = new Router()

router.get('/health', async (context, next) => {
  context.response.status = 200
  await next()
})

router.get('/component', genComponent)
router.get('/list', getList)
router.post('/upload', svgMulter.any(), upload)
router.post('/upload/check', checkUpload)
router.post('/delete', deleteIcons)
router.use('/tag', tag.routes(), tag.allowedMethods())

app.use(dataWrapper)
app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())

export default app.callback()
