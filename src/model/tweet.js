const mongoose = require("mongoose")

const Schema = mongoose.Schema

const tweetSchema = new Schema({
    byUser: { type: mongoose.Types.ObjectId, ref: 'users' },
    text: { type: String, required: true },
    createdDate: { type: Date, required: true },
    imageId: {type: mongoose.Types.ObjectId, ref: 'images'}
})

const tweetModel = mongoose.model("tweets", tweetSchema)

module.exports = { tweetModel, tweetSchema }
