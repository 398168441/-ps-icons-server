import BusinessError from './business-error'

export default async (ctx, next) => {
  try {
    await next()
    ctx.body = {
      code: 200,
      message: 'success',
      data: ctx.body
    }
  } catch (error) {
    let code = ctx.status
    let message = error.message || 'unknown error'
    if (error instanceof BusinessError) {
      ctx.status = 200
      code = error.code
    }
    ctx.body = {
      code,
      message
    }
  }
}
