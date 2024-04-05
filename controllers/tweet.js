const asyncHandler = require('express-async-handler')
const { tweetModel } = require("../model/tweet.js")
const {imageModel} = require("../model/image")


const getTweetById = (asyncHandler(async (req, res) => {
    const id = req.params.id
    const tweet = await tweetModel.findById(id)
    res.send(tweet)
}))

const getAllTweets = (asyncHandler(async (req, res) => {
    const tweets = await tweetModel.find({})
    res.json(tweets)
}))

const addImage = async (req, res)=>{
    const tweetId = req.params.id
    const tweet = await tweetModel.findById(tweetId)
    try{
        const newFile = new imageModel({
            filename: req.file.filename,
            path: req.file.path,
            encoding: req.file.encoding,
            size: req.file.size
        })
        const fileResult = await newFile.save()
        tweet.imageId = fileResult.id
        const newTweet = await tweet.save()
        return res.status(202).json(newTweet)
    }catch (e) {
        return res.error(e)
    }
}

module.exports = { getTweetById, getAllTweets, addImage }