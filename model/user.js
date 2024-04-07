const mongoose = require("mongoose")
const mongoosePaginate  = require("mongoose-paginate-v2");
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    dateOfBirth: Date,
    password: String,
    followers: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    followings: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    tweets: [{ type: mongoose.Types.ObjectId, ref: 'tweets' }],
    profileType: {
        type: String,
        enum: ['sso', 'normal'],
    }
})
userSchema.plugin(mongoosePaginate)
const userModel = mongoose.model("users", userSchema)

module.exports = { userModel, userSchema }

