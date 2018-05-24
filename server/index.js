const Koa  = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const mongoose = require('mongoose')

const { connect, initSchemas } = require('./database/init')

;(async () => {
    await connect()

    initSchemas()
})()

app.use(views(resolve(__dirname, './views'), { extension: 'pug' }))

app.use(async (ctx, next) => {
    await ctx.render('index', {
        you: 'Magic_su',
        me: 'Super'
    })
})

app.listen(4455)
console.log('Server running on Port: 4455')