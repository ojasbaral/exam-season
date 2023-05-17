const express = require('express')
const app = express()
const auth = require('./routes/auth')
const appMain = require('./routes/app')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(process.env.MONGODB_URI)
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/auth', auth)
app.use('/', appMain)


app.listen(5000, () => {
    console.log("[SERVER RUNNING (5000)]")
})