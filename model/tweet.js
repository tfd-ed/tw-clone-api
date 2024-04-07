const mongoose = require("mongoose")
const mongoosePaginate  = require("mongoose-paginate-v2");

const Schema = mongoose.Schema

const tweetSchema = new Schema({
    byUser: { type: mongoose.Types.ObjectId, ref: 'users' },
    text: { type: String, required: true },
    createdDate: { type: Date, required: true },
    imageId: {type: mongoose.Types.ObjectId, ref: 'images'}
})

tweetSchema.plugin(mongoosePaginate)
const tweetModel = mongoose.model("tweets", tweetSchema)

module.exports = { tweetModel, tweetSchema }
