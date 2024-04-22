const mongoose = require("mongoose")
const Schema = mongoose.Schema
const resetPasswordSchema = new Schema({
    byUser: { type: mongoose.Types.ObjectId, ref: 'users' },
    token: { type: String, required: true },
    expireIn: { type: Date, required: true, default: Date.now() + 3600000 } // 60 * 60 * 1000 = 3600000ms expires in 1 hour
})

const resetPaswordTokenModel = mongoose.model('resetPassToekns', resetPasswordSchema)
module.exports = { resetPaswordTokenModel, resetPasswordSchema }