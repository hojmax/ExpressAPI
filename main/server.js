const { errorMiddleware } = require('../main/middleware.js')
const customerRouter = require('../customer/router.js')
const loginRouter = require('../login/router.js')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const port = 3000

app.use(cookieParser())
app.use(express.json())
app.use(logger('dev', { skip: () => process.env.NODE_ENV == 'test' }))
app.use('/customer', customerRouter)
app.use('/auth', loginRouter)
app.use(errorMiddleware)
app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app