const { resetPaswordTokenModel } = require("../model/resetPassToken.js")
const checkIfUserHasResetPassToken = async (userID) => {
    try {
        const ifExistResetPassToken = await resetPaswordTokenModel.find({byUser: userID.toString()})
        ifExistResetPassToken.forEach(async (token)=> {
            if(token.expireIn > Date.now()) {
                await resetPaswordTokenModel.findByIdAndDelete(token._id)
            }
        })
        if(ifExistResetPassToken.length >= 2) return {error : true, message: "You Already! Please Check your email"}
    } catch (error) {
        console.log(error)
        return { error: error };
    }
}
module.exports = checkIfUserHasResetPassToken