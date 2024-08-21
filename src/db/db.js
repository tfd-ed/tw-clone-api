const mongoose = require("mongoose")
require('dotenv').config()
const uri = process.env.MONGODB_URI

//To-do retry every 10 seconds
async function dbConnect() {
    mongoose.connection.on('connected', () => console.log('connected'));
    mongoose.connection.on('open', () => console.log('open'));
    await mongoose.connect(uri, {
        dbName: 'tw-db'
    })
}

module.exports = dbConnect