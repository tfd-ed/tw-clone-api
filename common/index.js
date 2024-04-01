const { userModel } = require("../model/user.js")
const jwt = require("jsonwebtoken")

const checkIfEmailExist = async (email) => {
    const user = await userModel.findOne({ email: email })
    if (!user) return false
    return true
}

const signToken = (id, email, username) => {
    const token = jwt.sign({
        id: id,
        email: email,
        username: username
    }, process.env.SECRET, {
        expiresIn: '24h',
        issuer: 'api.tfdevs.com',
        audience: 'www.tfdevs.com'
    })
    return token
}

module.exports = {
    checkIfEmailExist,
    signToken
}