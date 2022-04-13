const jwt = require('jsonwebtoken')
require('dotenv').config()

const getAccessToken = (payload = {}) => (
    jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { expiresIn: '1800s' }
    )
)

const verify_jwt = (token, callback) => (
    jwt.verify(token, process.env.TOKEN_SECRET, callback)
)

module.exports = {
    getAccessToken,
    verify_jwt
}