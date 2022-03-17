require("dotenv").config()
const Message = require("./schemas/Message.js")
const express = require('express')
const mongoose = require("mongoose")
const listRouter = require('./routers/shoppingList.js')
var cors = require('cors')
const app = express()
const PORT = 3000

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/list', listRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

module.exports = app