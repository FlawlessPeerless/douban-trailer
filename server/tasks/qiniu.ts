// 七牛图片托管
import * as qiniu from 'qiniu'
import nanoid = require('nanoid')


import config from '../config/index'

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)

const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

/**
 * 上传至七牛
 */
async function uploadToQiniu(url :string, key :string) :Promise<any> {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}


interface movie {
    key? :string,
    videoKey? :string,
    coverKey? :string,
    posterKey? :string,
    video :string,
    doubanId :string,
    poster :string,
    cover :string, 
}

;(async () => {
    const movies :Array<movie> = [
        {
            video: 'http://vt1.doubanio.com/201805281346/1d9517b65ce05bf22b5e6d41855b2ab8/view/movie/M/302190491.mp4',
            doubanId: '26739551',
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2520161291.jpg',
            cover: 'https://img1.doubanio.com/img/trailer/medium/2493603388.jpg?'
        }
    ]

    movies.map(async movie => {
        if (movie.video && !movie.key) {

            try {
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
    
                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }

                console.log(movie)
            } catch (err) {
                console.log(err)
            }
            

        }
    })

})()



