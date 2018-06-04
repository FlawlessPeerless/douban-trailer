import Koa from 'koa'
import { resolve } from 'path';
import { Route } from '../lib/decorator';

export function router (app :Koa) {
    const apiPath = resolve(__dirname, '../routes')
    const router = new Route(app, apiPath)
    router.init()
}
