"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { promisify } = require('util');
// 加盐等级
const SALT_WORK_FACTOR = 10;
// 最大尝试次数
const MAX_LOGIN_ATTEMPTS = 5;
// 锁定时间 2h
const LOCK_TIME = 2 * 60 * 60 * 1000;
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
});
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
});
UserSchema.pre('save', function (next) {
    if (this.isModified('password'))
        return next();
    bycrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err)
            return next(err);
        bycrypt.hash(this.password, salt, (err, hash) => {
            if (err)
                return next(err);
            this.password = hash;
            next();
        });
    });
    next();
});
// 判断当前用户是否锁定
UserSchema.virtual('isLocked').get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});
UserSchema.method = {
    // 比较密码
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            promisify(bcrypt.compare)(_password, password)
                .then(isMatch => {
                resolve(isMatch);
            }, err => {
                reject(err);
            });
        });
    },
    // 比对登录次数
    incLoginAttepts(user) {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: { loginAttempts: 1 },
                    $unset: { lockUntil: 1 }
                }, err => {
                    if (!err)
                        resolve(true);
                    else
                        reject(err);
                });
            }
            else {
                let updates = {
                    $inc: { loginAttempts: 1 }
                };
                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS
                    && !this.isLocked) {
                    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
                }
                this.update(update, err => {
                    if (!err)
                        resolve(true);
                    else
                        reject(err);
                });
            }
        });
    }
};
mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map