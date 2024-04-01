const express = require("express")
const router = express.Router()
const { getTweetById, getAllTweets } = require("../controllers/tweet.js")

router.get("/", getAllTweets)

router.get("/:id", getTweetById)


module.exports = router