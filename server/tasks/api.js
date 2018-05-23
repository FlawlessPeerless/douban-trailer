const rp = require('request-promise-native')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

    const res = await rp(url)

    return res
}

;(async () => {
    let movies = [
        { doubanId: 30196755,
            title: '世界奇妙物语 2018年春季特别篇',
            rate: 7,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2522281465.jpg' },
        { doubanId: 27026132,
            title: '华氏451',
            rate: 5.2,
            poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2521931429.jpg' }
        ]

    
     movies.map(async movie => {
         let movieData = await fetchMovie(movie)

         try {
            movieData = JSON.parse(movieData)
         } catch(err) {
            console.log(err)
         }
         console.log(movieData)
     })   

})()