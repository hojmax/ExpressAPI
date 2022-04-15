const { joiError, invalidTokenError, missingTokenError } = require('./error.js')
const { verify_jwt } = require('../login/jwt.js')

const joiMiddleware = (schema, property) => (req, res, next) => {
    const { error } = schema(req[property])
    next(error && joiError(error))
}

const errorMiddleware = (err, req, res, next) => res.status(err.status || 500).send(err.message)

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return next(missingTokenError)
    const token = authHeader && authHeader.split(' ')[1]
    verify_jwt(
        token,
        'access',
        (err, decoded) => {
            req.payload = decoded
            next(err && invalidTokenError)
        }
    )
}

module.exports = { joiMiddleware, errorMiddleware, jwtMiddleware }