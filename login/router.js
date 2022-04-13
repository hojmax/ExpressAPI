const { joiMiddleware } = require('../middleware.js')
const { getHashPass } = require('./queries.js')
const { validateLogin } = require('./validation.js')
const { getAccessToken } = require('./jwt.js')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const loginError = { message: 'Invalid email or password', status: 401 }

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