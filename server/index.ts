import * as Koa from 'koa'
import * as views from 'koa-views'
import * as bodyParser from 'koa-bodyparser'
import * as mongoose from 'mongoose'
import { resolve } from 'path'

import { connect, initSchemas } from './database/init.js'

const MIDDLEWARES = ['router']

const app = new Koa()

;(async () => {
    await connect()

    initSchemas()
})()

async function useMiddlewares(app :Koa) {
    MIDDLEWARES.map(name => {
        let path = resolve(__dirname, `./middlewares/${name}.js`)
        

        import(path)
        .then((module) => {
            console.log(module)
            module[name](app)
        })
    })
}

async function start() {
    app.use(bodyParser())

    await useMiddlewares(app)

    app.listen(4466)
    console.log('Server is running on port: 4466!')
}

start()
