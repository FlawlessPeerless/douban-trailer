"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const rp = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
function fetchMovie(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://api.douban.com/v2/movie/${item.doubanId}`;
        const res = yield rp(url);
        let body;
        try {
            body = JSON.parse(res);
        }
        catch (err) {
            console.log(err);
        }
        return body;
    });
}
;
(() => __awaiter(this, void 0, void 0, function* () {
    let movies = yield Movie.find({});
    console.log(movies);
    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let movieData = yield fetchMovie(movie);
        if (movieData) {
            let tags = movieData.tags || [];
            tags.forEach(tag => {
                movie.tags.push(tag.name);
            });
            movie.summary = movieData.summary || '';
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle = movieData.title || '';
            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || [];
                movie.year = movieData.attrs.year[0] || 2500;
                for (let i = 0; i < movie.movieTypes.length; i++) {
                    let item = movie.movieTypes[i];
                    let cat = yield Category.findOne({
                        name: item
                    });
                    if (!cat) {
                        cat = new Category({
                            name: item,
                            movies: [movie._id]
                        });
                    }
                    else {
                        if (cat.movies.indexOf(movie._id) === -1) {
                            cat.movies.push(movie._id);
                        }
                    }
                    yield cat.save();
                    if (!movie.category) {
                        movie.category.push(cat._id);
                    }
                    else {
                        if (movie.category.indexOf(cat._id) === -1) {
                            movie.category.push(cat._id);
                        }
                    }
                }
                let dates = movieData.attrs.pubdate || [];
                let pubdates = [];
                dates.map(item => {
                    if (item && item.split('(').length > 0) {
                        let parts = item.split('(');
                        let date = parts[0];
                        let country = '未知';
                        if (parts[1]) {
                            country = parts[1].split(')')[0];
                        }
                        pubdates.push({
                            date: new Date(date),
                            country
                        });
                    }
                });
                movie.pubdate = pubdates;
            }
            console.log(movie);
            yield movie.save();
        }
    }
    //  movies.map(async movie => {
    //      let movieData = await fetchMovie(movie)
    //      try {
    //         movieData = JSON.parse(movieData)
    //      } catch(err) {
    //         console.log(err)
    //      }
    //      console.log(movieData)
    //  })   
}))();
//# sourceMappingURL=api.js.map