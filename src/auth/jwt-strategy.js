const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { userModel } = require("../model/user.js")

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
    issuer: 'api.tfdevs.com',
    audience: 'www.tfdevs.com'
}

const jwtStrategy = new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await userModel.findById(jwt_payload.id)
    if (!user) {
        done(null, false)
    }
    done(null, user)
})

module.exports = { jwtStrategy }