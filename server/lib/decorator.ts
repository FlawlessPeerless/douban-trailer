import * as Koa from 'koa'
import * as Router from "koa-router"
import { resolve } from 'path'
import * as glob from 'glob'

const symbolPrefix = Symbol('prefix')
const routerMap :IRouterConfig[] = []
const isArray = (c :any) => Array.isArray(c) ? c : [c]


// 装饰器
export class Route {
    private app :Koa
    private apiPath :string
    private router :any


    constructor(app :Koa, apiPath :string) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router
    }

    public init() {
        const { app, router, apiPath } = this
        // 同步引入匹配文件
        glob.sync(resolve(this.apiPath, './*.js'))
        .forEach(path => {
            require(path)
        })

        routerMap.map(({target, method, path, callback}) => {
            const prefix = target[symbolPrefix]
            router[method](prefix + path, callback)
        }, router)

        app.use(router.routes())
        app.use(router.allowedMethods())
    }
}

function normalizePath (path :string) {
    return path.startsWith('/') ? path : `/${path}`
}

export const setRouter = (method :Method) => (path :string) => (target :any, key :string, descriptor :any) => {
    routerMap.push({
      target,
      method,
      path,
      callback: target[key]
    })
    return descriptor
  }

function controller (path :string) {
    return (target :Function) => { target.prototype[symbolPrefix] = path } 
}

function get (path :string) {
    return setRouter('get')(path)
}

function post (path :string) {
    return setRouter('post')(path)
}

function put (path :string) {
    return setRouter('put')(path)
}

function del (path : string) {
    return setRouter('del')(path)
}

function use (path :string) {
    return setRouter('use')(path)
}

function all (path :string) {
    return setRouter('all')(path)
}

interface IRouterConfig {
    method :Method
    path :any,
    target? :any,
    callback: Function[]
}

type Method = "all" | "post" | "get" | "put" | "del" | "use"

export { controller, all, use, get, post, del, put }