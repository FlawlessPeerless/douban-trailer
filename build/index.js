"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const views = require("koa-views");
const path_1 = require("path");
const init_js_1 = require("./database/init.js");
const app = new Koa();
(() => __awaiter(this, void 0, void 0, function* () {
    yield init_js_1.connect();
    init_js_1.initSchemas();
}))();
app.use(views(path_1.resolve(__dirname, './views'), { extension: 'pug' }));
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield ctx.render('index', {
        you: 'super',
        me: 'kuli'
    });
}));
app.listen(4466);
console.log('Server is running on port: 4466!');
//# sourceMappingURL=index.js.map