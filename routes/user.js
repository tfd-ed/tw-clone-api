const express = require("express")
const router = express.Router()
const { getAllUsers, getUserById, updateById, deleteById, getTweetsByUserId } = require("../controllers/user.js")
const {validateObjectId} = require('../middleware/index.js')

router.get("/", getAllUsers)

router.get("/:id", validateObjectId, getUserById)

router.get("/:id/tweets", validateObjectId, getTweetsByUserId)

router.put("/:id", validateObjectId, updateById)

router.delete("/:id", validateObjectId, deleteById)

module.exports = router