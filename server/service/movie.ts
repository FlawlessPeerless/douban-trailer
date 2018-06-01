// movie 业务层
import mongoose from 'mongoose'
import { default as Movie, MovieModel } from '../database/schema/movie'
//const Movie = mongoose.model('Movie')

async function getAllMovies (type :string, year :number) {
    let query :any = {}

    if (type) {
        query.movieTypes = {
            $in: [type]
        }
    }

    if (year) {
        query.year = year
    }

    const movies = await Movie.find(query)
    return movies
}

async function getMovieDetail (id :number) {
    const movie = await Movie.findOne({ _id: id })
    return movie
}

async function getRelativeMovies(movie :MovieModel) {
    const movies = await Movie.find({
        movieTypes: { $in: movie.movieTypes }
    })

    return movies
}

export {
    getAllMovies,
    getMovieDetail,
    getRelativeMovies
}