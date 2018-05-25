"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cp = require('child_process');
const { resolve } = require('path');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
(() => __awaiter(this, void 0, void 0, function* () {
    const script = resolve(__dirname, '../crawler/trailer-list');
    const child = cp.fork(script, []);
    let invoked = false;
    child.on('err', err => {
        if (invoked)
            return;
        invoked = true;
        console.log(err);
    });
    child.on('exit', code => {
        if (invoked)
            return;
        invoked = true;
        let err = code === 0 ? null : new Error('exit code ' + code);
        console.log(err);
    });
    child.on('message', data => {
        let result = data.result;
        // 导入数据至mongodb
        result.forEach((item) => __awaiter(this, void 0, void 0, function* () {
            let movie = yield Movie.findOne({
                doubanId: item.doubanId
            });
            if (!movie) {
                movie = new Movie(item);
                yield movie.save();
            }
        }));
    });
}))();
//# sourceMappingURL=movie.js.map