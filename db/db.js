const mongoose = require("mongoose")
const url = "mongodb://localhost:27017/my-db"
require('dotenv').config()
const uri = process.env.MONGODB_URI

//To-do retry every 10 seconds
async function dbConnect() {
    // console.log(uri)
    mongoose.connection.on('connected', () => console.log('connected'));
    mongoose.connection.on('open', () => console.log('open'));
    await mongoose.connect(url, {
        dbName: 'tw-db'
    })
}

module.exports = dbConnect