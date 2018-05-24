const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types

const MovieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },

    category: {
        type: ObjectId,
        ref: 'Category'
    },

    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    rawTitle: String,
    movieTypes: [String],
    pubdate: Mixed,
    year: Number,

    videoKey: String,
    coverKey: String,
    posterKey: String,

    tags: Array,

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

MovieSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Movie', MovieSchema)
