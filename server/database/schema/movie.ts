import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const { Mixed, ObjectId } = Schema.Types

export type MovieModel = mongoose.Document & {
    doubanId :string
    category :any[]
    rate :number
    title :string
    summary :string
    video :string
    poster :string
    cover :string
    rawTitle :string
    movieTypes :string[]
    pubdate :mongoose.Schema.Types.Mixed,
    year :number,
    videoKey :string
    coverKey: string
    posterKey: string
    tags :string[]
    meta: {
        createdAt :number
        updateAt :number
    }
}

const MovieSchema :mongoose.Schema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },

    category: [{
        type: ObjectId,
        ref: 'Category'
    }],

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

MovieSchema.pre<MovieModel>('save', function(next :Function) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

export default mongoose.model<MovieModel>('Movie', MovieSchema)
