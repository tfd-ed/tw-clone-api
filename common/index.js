const { userModel } = require("../model/user.js")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')

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

const sendEmail = async (emailOption) => {
    // My use case im using https://app.brevo.com/ SMTP Gateway
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_GATEWAY,
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
    if (!emailOption.to) return 0;
    const sendMail = await transporter.sendMail(emailOption);
    if(sendMail.error) return {error: true, message: error};
    return { message: `Email sent successfully to ${emailOption.to}`, info: sendMail }
}
module.exports = {
    checkIfEmailExist,
    signToken,
    sendEmail
}