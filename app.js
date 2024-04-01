const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')
const port = 3000
const user = require("./routes/user.js")
const auth = require("./routes/auth.js")
const tweet = require("./routes/tweet.js")
const morgan = require('morgan')
const responseTime = require('response-time')
// const cors = require('cors')
const path = require("path")
require('dotenv').config()
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express');
const {openapiSpecification} = require("./swagger/config")

const dbConnect = require("./db/db.js")
const passport = require("passport")
const { jwtStrategy } = require("./auth/jwt-strategy.js")

passport.use(jwtStrategy)
dbConnect().catch((err) => { console.log(err) })


app.use(helmet())
// app.use(cors())
app.use(responseTime())
app.use(morgan('combined'))
app.use(compression())
app.use(bodyParser.json())



app.use("/api/users", passport.authenticate('jwt', { session: false }), user)
app.use("/api/tweets", passport.authenticate('jwt', { session: false }), tweet)
app.use("/api/auth", auth)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification,{
    explorer: true
}))

// Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Route all requests to index.html for Vue routing to handle
// All routes for API need to put before catch all routes
// So put `*` at the end
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})