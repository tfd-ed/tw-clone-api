const express = require("express")
const router = express.Router()
const { getAllUsers, getUserById, updateById, deleteById, getTweetsByUserId } = require("../controllers/user.js")

router.get("/", getAllUsers)

router.get("/:id", getUserById)

router.get("/:id/tweets", getTweetsByUserId)

router.put("/:id", updateById)

router.delete("/:id", deleteById)

module.exports = router