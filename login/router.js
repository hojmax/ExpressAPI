const { joiMiddleware } = require('../middleware.js')
const { getHashPass } = require('./queries.js')
const { validateLogin } = require('./validation.js')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')

dotenv.config()

const loginError = { message: 'Invalid email or password', status: 401 }

const generateAccessToken = (payload = {}) => (
    jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { expiresIn: '1800s' }
    )
)

router.post('/', joiMiddleware(validateLogin, 'body'), (req, res, next) => {
    const { email, password } = req.body
    getHashPass(email)
        .then(data => {
            const hash_pass = data[0] && data[0].hash_pass
            bcrypt.compare(password, hash_pass, (err, valid) => {
                if (err || !valid) return next(loginError)
                const accessToken = generateAccessToken()
                res.send(accessToken)
            })
        })
        .catch(next)
})

module.exports = router