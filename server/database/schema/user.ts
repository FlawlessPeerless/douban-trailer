import { default as mongoose, Model, Schema, Mongoose, model } from 'mongoose'

import bcrypt from 'bcrypt'
import { promisify } from 'util'
// 加盐等级
const SALT_WORK_FACTOR :number = 10
// 最大尝试次数
const MAX_LOGIN_ATTEMPTS = 5 
// 锁定时间 2h
const LOCK_TIME = 2 * 60 * 60 * 1000

export type UserModel = mongoose.Document & {
    username :string
    email :string
    password :string
    loginAttempts : number
    meta: {
        createdAt :number
        updateAt :number
    },
    lockUntil? :number,
    isLocked? :boolean,
}

interface UserModelInterface extends UserModel {
    comparePassword(_password:string, password:string) :boolean
}


const UserSchema = new Schema({
    username: {
        unique: true,
        type: String
    },
    email: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre<UserModel>('save', function(next :any) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

UserSchema.pre<UserModel>('save', function(next) {
    if (this.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err)

            this.password = hash
            next()
        })
    })

    next()
})

// 判断当前用户是否锁定
UserSchema.virtual('isLocked').get(function(this :UserModel) {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.method({
    // 比较密码
    comparePassword (_password :string, password :string) :Promise<boolean> {
        return new Promise((resolve, reject) => {
            promisify(bcrypt.compare)(_password, password)
            .then((isMatch :boolean)=> {
                resolve(isMatch)
            }, (err :Error) => {
                reject(err)
            })
        })
    },

    // 比对登录次数
    incLoginAttepts(this :UserModel) {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: { loginAttempts: 1 },
                    $unset: { lockUntil: 1 }
                }, (err :Error) => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates :any = {
                    $inc: { loginAttempts: 1 }
                }

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS
                    && !this.isLocked) {
                        updates.$set = { lockUntil: Date.now() + LOCK_TIME }
                }
                this.update(updates, (err :Error) => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }

})

export default model<UserModelInterface>('User', UserSchema)