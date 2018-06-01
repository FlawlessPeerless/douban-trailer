import * as Koa from 'koa'
import Router from "koa-router"
import { resolve } from 'path'
import glob from 'glob'

const symbolPrefix = Symbol('prefix')
const routerMap :Map<string, any> = new Map()
const isArray = (c :any) => Array.isArray(c) ? c : [c]


// 装饰器
export class Route {
    private app :Koa
    private apiPath :string
    private router :Router


    constructor(app :Koa, apiPath :string) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router
    }

    public init() {
        // 同步引入匹配文件
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controller) 
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}

function normalizePath (path :string) {
    return path.startsWith('/') ? path : `/${path}`
}

function router (conf :IRouterConfig) {
    return (target :any, key :string, descriptor: any) => {
        conf.path = normalizePath(conf.path)

        routerMap.set(target[key],{
            target: target,
            ...conf
        })
    }
}

function controller (path :string) {
    return (target :Function) => { target.prototype[symbolPrefix] = path } 
}

function get (path :string) {
    return router({
        method: 'get',
        path: path
    })
}

function post (path :string) {
    return router({
        method: 'post',
        path: path
    })
}

function put (path :string) {
    return router({
        method: 'put',
        path: path
    })
}

function del (path : string) {
    return router({
        method: 'del',
        path
    })
}

function use (path :string) {
    return router({
        method: 'use',
        path
    })
}

function all (path :string) {
    return router({
        method: 'all',
        path
    })
}

interface IRouterConfig {
    method :Method
    path :any,
    target? :any,
}

type Method = "all" | "post" | "get" | "put" | "del" | "use"

export { controller, all, use, get, post, del, put }