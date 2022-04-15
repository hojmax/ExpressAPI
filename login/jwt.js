const jwt = require('jsonwebtoken')
require('dotenv').config()

const secrets = {
    'access': process.env.ACCESS_TOKEN_SECRET,
    'refresh': process.env.REFRESH_TOKEN_SECRET
}

const tokenDuration = {
    access: '10m',
    refresh: '30d'
}

const getJWT = (type, payload = {}) => (
    jwt.sign(payload, secrets[type], { expiresIn: tokenDuration[type] })
)

const verify_jwt = (token, type, callback) => (
    jwt.verify(token, secrets[type], callback)
)

module.exports = {
    getJWT,
    verify_jwt
}