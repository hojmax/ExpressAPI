const jwt = require('jsonwebtoken')

const joiMiddleware = (schema, property) => (req, res, next) => {
    const { error } = schema(req[property])
    next(error && {
        message: error.details[0].message,
        status: 400
    })
}

const errorMiddleware = (err, req, res, next) => res.status(err.status || 500).send(err.message)

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return next({ message: 'Invalid token', status: 401 })
        req.payload = decoded
        next()
    })
}

module.exports = { joiMiddleware, errorMiddleware, jwtMiddleware }