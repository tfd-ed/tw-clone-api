const { faker } = require('@faker-js/faker');
const { userModel } = require('./model/user.js')
const { tweetModel } = require('./model/tweet.js')
const users = 10;
const tweets = 1000;

const dbConnect = require("./db/db.js")

dbConnect().catch((err) => { console.log(err) })

async function generate() {
    let userList = []
    for (let i = 0; i < users; i++) {
        let user = new userModel({
            email: faker.internet.email(),
            username: faker.internet.userName(),
            dateOfBirth: faker.date.birthdate(),
            password: faker.internet.password()
        })
        const result = await user.save()
        userList.push(result._id)
        console.log(`user: ${result._id} generated!`)
    }

    for (let i = 0; i < tweets; i++) {
        const randomElement = userList[Math.floor(Math.random() * userList.length)];
        let tweet = new tweetModel({
            byUser: randomElement,
            text: faker.lorem.paragraph(),
            createdDate: new Date()
        })
        const result = await tweet.save()
        console.log(`tweet: ${result._id} generated!`)
    }
}

generate()