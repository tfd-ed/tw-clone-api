const { resetPaswordTokenModel } = require("../model/resetPassToken.js")
const checkIfUserHasResetPassToken = async (userID) => {
    const ifExistResetPassToken = await resetPaswordTokenModel.find({ byUser: userID.toString() });
    if (!ifExistResetPassToken) return true;
    for (const token of ifExistResetPassToken) {
        if (token.expireIn > Date.now()) {
            await resetPaswordTokenModel.findByIdAndDelete(token._id);
        }
    }
    if (ifExistResetPassToken.length >= 2) return { error: true, message: "Check your email for the password reset link!" };
    else return true;
}
module.exports = checkIfUserHasResetPassToken