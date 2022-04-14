const { joiMiddleware } = require('../main/middleware.js')
const { getHashPass } = require('./queries.js')
const { validateLogin } = require('./validation.js')
const { getAccessToken } = require('./jwt.js')
const { loginError } = require('../main/error.js')
const router = require('express').Router()
const bcrypt = require('bcrypt')


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