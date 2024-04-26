const { checkSchema } = require("express-validator")
const { userModel } = require("../model/user.js")
const { checkIfEmailExist, checkIfResetPassTokenifExist } = require("../common/index.js")
const { token } = require("morgan")

const createUserValidator = checkSchema({
    username: {
        isLength: {
            options: {
                max: 20,
                min: 3
            },
            errorMessage: "Username's length must be 20 characters maximum and 3 characters minimum."
        }
    },
    email: {
        isEmail: true,
        errorMessage: "Invalid email address",
        custom: {
            options: async value => {
                const ifExist = await checkIfEmailExist(value)
                if (ifExist) throw new Error("Email already registered!")
            }
        }
    },
    password: {
        isLength: {
            options: {
                max: 30,
                min: 6
            },
            errorMessage: "Password length must be 20 characters maximum and 3 characters minimum."
        }
    },
    confirmedPassword: {
        isLength: {
            options: {
                max: 30,
                min: 6
            },
            errorMessage: "Password length must be 20 characters maximum and 3 characters minimum."
        },
        custom: {
            options: async (value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("Password mismatched!")
                }
            }
        }
    }
})

const loginUserValidator = checkSchema({
    email: {
        isEmail: true,
        errorMessage: "Invalid email address",
        custom: {
            options: async value => {
                const ifExist = await checkIfEmailExist(value)
                if (!ifExist) throw new Error("Email not registered!")
                // Check if normal user
            }
        }
    },
    password: {
        isLength: {
            options: {
                max: 30,
                min: 6
            },
            errorMessage: "Password length must be 20 characters maximum and 3 characters minimum."
        }
    }
})
const forgotPasswordValidator = checkSchema({
    email: {
        isEmail: true,
        errorMessage: "Invalid email address",
        custom: {
            options: async value => {
                const ifReqValidateSuccess = await checkIfResetPassTokenifExist(value)
                if (ifReqValidateSuccess.error) throw new Error(ifReqValidateSuccess.message)
            }
        }
    }
})

const resetPasswordValidator = checkSchema({
    exp: {
        custom: {
            options: async (value) => {
                if (value < Date.now()) {
                    throw new Error("Request token is expired!")
                }
            }
        }
    },
    id: {
        isLength: {
            options: {
                min: 24, // 12 byte as a 24 character hex string MongoDB object ID Standard
                max: 24
            },
            errorMessage: "Url request is incorrect format!"
        }
    },
    token: {
        isLength: {
            options: {
                min: 64, // 32 byte as a 64 character standard by Cypto JS String hex
                max: 64
            },
            errorMessage: "Url request is incorrect format!"
        }
    },
    password: {
        isLength: {
            options: {
                max: 30,
                min: 6
            },
            errorMessage: "Password length must be 20 characters maximum and 3 characters minimum."
        }
    },
    confirmedPassword: {
        isLength: {
            options: {
                max: 30,
                min: 6
            },
            errorMessage: "Password length must be 20 characters maximum and 3 characters minimum."
        },
        custom: {
            options: async (value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("Password mismatched!")
                }
            }
        }
    }
})
module.exports = { createUserValidator, loginUserValidator, forgotPasswordValidator, resetPasswordValidator }