const { userModel } = require("../model/user.js")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const { resetPaswordTokenModel } = require("../model/resetPassToken.js")

const checkIfEmailExist = async (email) => {
    const user = await userModel.findOne({ email: email })
    if (!user) return false
    return true
}
const checkIfResetPassTokenifExist = async (email) => {
    // if email exists
    const user = await userModel.findOne({ email: email })
    if (!user) return { error: true, message: "Email does not exist!" };
    // Check if user dont have reset password token
    const ifExistResetPassToken = await resetPaswordTokenModel.find({ byUser: user._id.toString() })
    if (!ifExistResetPassToken) return { error: false, message: "Email is empty token! Possible to request new token." }
    // clear expired tokens
    for (const token of ifExistResetPassToken) {
        if (token.expireIn < Date.now()) {
            await resetPaswordTokenModel.findByIdAndDelete(token._id);
        }
    }
    // if user have request more then 3 time in 1h (basic rate limite)
    if (ifExistResetPassToken.length >= 3) return { error: true, message: "Check your email for the password reset link!" };
    return { error: false, message: 'Email validation success' };
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
const sendEmail = async (emailOption) => {
    // My use case im using https://app.brevo.com/ SMTP Gateway
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
    if (!emailOption.to) return { error: true, message: 'invalid email option (email receiver not provided)' };
    const sendMail = await transporter.sendMail(emailOption);
    if (sendMail.error) return { error: true, message: error };
    return {error: false,  message: `Email sent successfully to ${emailOption.to}`, info: sendMail }
}
module.exports = {
    checkIfEmailExist,
    signToken,
    sendEmail,
    checkIfResetPassTokenifExist
}