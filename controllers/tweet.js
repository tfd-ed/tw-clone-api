const asyncHandler = require('express-async-handler')
const { tweetModel } = require("../model/tweet.js")
const {imageModel} = require("../model/image")
const getTweetById = (asyncHandler(async (req, res) => {
    const id = req.params.id
    const tweet = await tweetModel.findById(id)
    res.send(tweet)
}))

const getAllTweets = async (req, res, next) => {
    try {
      const limit = parseFloat(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const myCustomLabels = {
        totalDocs: "itemCount",
        docs: "results",
        limit: "perPage",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "pageCount",
        pagingCounter: "slNo",
        meta: "paginator",
      };
      const options = {
        page: page,
        limit: limit,
        customLabels: myCustomLabels,
      };
      const tweets = await tweetModel.paginate({}, options);
      res.status(200).json(tweets);
    } catch (err) {
      next(err);
    }
  };

const addImage = async (req, res)=>{
    const tweetId = req.params.id
    try{
        const tweet = await tweetModel.findById(tweetId)
    }catch (e) {
        return res.status(400).send(e)
    }
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
        return res.status(400).send(e)
    }
}

module.exports = { getTweetById, getAllTweets, addImage }