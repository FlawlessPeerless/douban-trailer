import { Context } from 'koa'
import * as Router from 'koa-router'
import * as mongoose from 'mongoose'
import { get, post, controller } from '../lib/decorator'

import { 
    getAllMovies, 
    getMovieDetail, 
    getRelativeMovies 
} from '../service/movie'

const router :Router = new Router()

@controller('/api/v0/movies')
export class movieController {
    @get('/')
    public async getMovies (ctx :Context, next: any) {
        const { type, year } = ctx.query
        const movies = await getAllMovies(type, year)
        
        ctx.body = {
            movies
        }
    }

    @get('/:id')
    public async getMovieDetail (ctx :Context) {
        const id = ctx.params.id
        const movie = await getMovieDetail(id)
        let relativeMovies = null
        if (movie) {
            relativeMovies = await getRelativeMovies(movie)
        }
        ctx.body = {
            data: {
                movie,
                relativeMovies
            },
            success: true
        }
    }

}

export default router