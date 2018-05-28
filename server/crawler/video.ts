// 视频爬取
import * as puppeteer from 'puppeteer'

const BASE = 'https://movie.douban.com/subject/'
const doubanId :string = '26739551'
const VIDEO_BASE :string = 'https://movie.douban.com/trailer/219491'


function sleep (time :number) :Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

;(async () => {
    console.log('Start visit the target page ')

    let browser :puppeteer.Browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    let page :puppeteer.Page = await browser.newPage()
    let response :puppeteer.Response | null = await page.goto(BASE + doubanId, {
        waitUntil: 'networkidle2'
    })
    console.log(response)
    let data
    if (response && response.ok()) {
        let result = await page.evaluate(() => {
            var it :JQuery = $('.related-pic-video')

            if (it && it.length > 0) {
                var link = it.attr('href')
                var cover = it.find('img').attr('src')

                return { link, cover }
            }

            return {}
        })

        let video :string = ''
        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2'
            })
            
            await sleep(2000)
            
            video = await page.evaluate(() => {
                var it :JQuery = $('source')

                if (it && it.length > 0) {
                    return it.attr('src')
                }
                return ''
            })
        } 

        
        data = {
            video,
            doubanId,
            cover: result.cover
        }
    }

    browser.close()

    if (process.send) {
        process.send(data)
    }   

    process.exit(0)

})()