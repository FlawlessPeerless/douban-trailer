import { Context } from 'koa'
import * as Router from 'koa-router'
import * as mongoose from 'mongoose'
import { get, post, controller } from '../lib/decorator'

import { 
    checkPassword
} from '../service/admin'

const router :Router = new Router()

@controller('/api/v0/user')
export class userController {
    @post('/')
    public async login (ctx :Context, next: any) {
        const { email, password } = ctx.request.body
        const matchData = await checkPassword(email, password)

        if (!matchData.user) {
            return ctx.bodu = {
                success: false,
                err: '用户不存在'
            }
        }

        if (matchData.match) {
            return ctx.body = {
                success: true
            }
        }
        return ctx.bodu = {
            success: false,
            err: '密码不正确'
        }
    }

}

export default router