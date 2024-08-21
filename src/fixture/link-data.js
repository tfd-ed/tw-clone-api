const { userModel } = require('../model/user.js')
const { tweetModel } = require('../model/tweet.js')

const dbConnect = require("../db/db.js")

dbConnect().catch((err) => { console.log(err) })

async function linkRelationship() {
    const tweets = await tweetModel.find({})
    const users = await userModel.find({})
    users.forEach(async user => {
        const belongTweet = tweets.filter(tt => {
            return tt.byUser.toString() == user._id
        })
        let tweetArray = []
        belongTweet.forEach(ttt => {
            tweetArray.push(ttt._id)
        })
        user.tweets = tweetArray
        await user.save()
        console.log(`user: ${user._id} saved with tweets: ${tweetArray.length}`)
    })
}
linkRelationship()