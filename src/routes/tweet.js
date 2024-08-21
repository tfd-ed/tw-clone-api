const express = require("express")
const router = express.Router()
const multer  = require('multer')
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
    }
})
const upload = multer({ storage: storage })
const { getTweetById, getAllTweets, addImage } = require("../controllers/tweet.js")

router.get("/", getAllTweets)

router.get("/:id", getTweetById)

router.post("/:id/image", upload.single("image"), addImage)


module.exports = router