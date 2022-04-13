const express = require('express')
const logger = require('morgan')
const customerRouter = require('./customer/router.js')
const loginRouter = require('./login/router.js')
const { errorMiddleware } = require('./middleware.js')
const app = express()
const port = 3000

app.use(express.json())
app.use(logger('dev', { skip: () => process.env.NODE_ENV == 'test' }))
app.use('/customer', customerRouter)
app.use('/login', loginRouter)
app.use(errorMiddleware)
app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app