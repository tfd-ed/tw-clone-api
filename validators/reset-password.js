const { resetPaswordTokenModel } = require("../model/resetPassToken.js")
const bcrypt = require('bcrypt')
const resetPassTokenValidate = async (req) => {
    if (!req.id || !req.token) return { error: true, message: "incorrect url format!" };
    const valideUser = await resetPaswordTokenModel.findOne({ byUser: req.id })
    // verify User request id
    if (!valideUser) return { error: true, message: 'Request Token Is Invalid!' }
    // validate token expiration
    if (valideUser.expireIn > Date.now()) return { error: true, message: 'Request token is expired!' }
    // compare token
    const tokenIsMatch = await bcrypt.compare(req.token, valideUser.token)
    if (!tokenIsMatch) return { error: true, message: "Invalid token isn't match!"}
    else return valideUser;
}
module.exports = resetPassTokenValidate