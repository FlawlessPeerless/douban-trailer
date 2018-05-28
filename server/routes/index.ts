import * as Router from 'koa-router'
import * as mongoose from 'mongoose'

const router :Router = new Router()

router.get('/movies/all', async (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
        'meta.createAt': -1
    })

    ctx.body = {
        movies
    }
})

router.get('/movies/detail/:id', async (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.findOne({ _id: id })

    ctx.body = {
        movie
    }
})

export default router