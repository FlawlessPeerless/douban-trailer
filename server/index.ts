import * as Koa from 'koa'
import * as views from 'koa-views'
import * as mongoose from 'mongoose'
import { resolve } from 'path'

import { connect, initSchemas } from './database/init.js'


const app = new Koa()

;(async () => {
    await connect()

    initSchemas()
})()

app.use(views(resolve(__dirname, './views'), { extension: 'pug' }))
app.use(async (ctx, next) => {
    await ctx.render('index', {
        you: 'super',
        me: 'kuli'
    })
})

app.listen(4466)
console.log('Server is running on port: 4466!')