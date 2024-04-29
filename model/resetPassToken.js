const mongoose = require("mongoose")
const Schema = mongoose.Schema
const resetPasswordSchema = new Schema({
    byUser: { type: mongoose.Types.ObjectId, ref: 'users' },
    token: { type: String, required: true },
    expireIn: { type: Number, required: true, default: Date.now() + process.env.RESET_PASS_TOKEN_EXPIRED_IN } // 60 * 60 * 1000 = 3600000ms expires in 1 hour
})

const resetPaswordTokenModel = mongoose.model('reset-pass-tokens', resetPasswordSchema)
module.exports = { resetPaswordTokenModel, resetPasswordSchema }