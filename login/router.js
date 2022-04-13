const { joiMiddleware } = require('../middleware.js')
const { getHashPass } = require('./queries.js')
const { validateLogin } = require('./validation.js')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const loginError = { message: 'Invalid email or password', status: 401 }

const getAccessToken = (payload = {}) => (
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
            const hashPass = data[0]?.hash_pass
            if (!hashPass) return next(loginError)
            bcrypt.compare(password, hashPass)
                .then(isValid => isValid ? res.send(getAccessToken()) : next(loginError))
                .catch(next)
        })
        .catch(next)
})

module.exports = router