"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const puppeteer = require('puppeteer');
const url = `https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=`;
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});
(() => __awaiter(this, void 0, void 0, function* () {
    console.log('Start visit the target page');
    const browser = yield puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });
    const page = yield browser.newPage();
    yield page.goto(url, {
        waitUntil: 'networkidle2'
    });
    yield sleep(3000);
    yield page.waitForSelector('.more');
    for (let i = 0; i < 1; i++) {
        yield sleep(3000);
        yield page.click('.more');
    }
    const result = yield page.evaluate(() => {
        var $ = window.$;
        var items = $('.list-wp a');
        var links = [];
        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item);
                let doubanId = it.find('.cover-wp').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');
                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                });
            });
        }
        return links;
    });
    browser.close();
    process.send({ result });
    process.exit(0);
}))();
//# sourceMappingURL=trailer-list.js.map