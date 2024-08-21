const mongoose = require("mongoose")

const Schema = mongoose.Schema

const imageSchema = new Schema({
    path: {type: String, required: true},
    filename: {type: String, required: true},
    encoding: {type: String, required: true},
    createdDate: { type: Date, required: true, default: Date.now() },
    size: {type: Number, required: true}
})

const imageModel = mongoose.model("images", imageSchema)

module.exports = { imageModel, imageSchema }
