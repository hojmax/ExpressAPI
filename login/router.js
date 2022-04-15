const { joiMiddleware } = require('../main/middleware.js')
const { getJWT, verify_jwt } = require('./jwt.js')
const { validateLogin } = require('./validation.js')
const { loginError, missingTokenError } = require('../main/error.js')
const { getHashPass } = require('./queries.js')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
}

router.post('/login', joiMiddleware(validateLogin, 'body'), async (req, res, next) => {
    const { email, password } = req.body
    var data = await getHashPass(email).catch(next)

    const hashPass = data[0]?.hash_pass
    if (!hashPass) return next(loginError)

    const isValid = await bcrypt.compare(password, hashPass).catch(next)
    if (!isValid) return next(loginError)

    res.cookie(
        'refreshToken',
        getJWT('refresh'),
        cookieOptions
    )
        .send({
            accessToken: getJWT('access')
        })
})

router.post('/refresh', (req, res, next) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) return next(missingTokenError)
    verify_jwt(
        refreshToken,
        'refresh',
        err => err ? next(invalidTokenError) : res.send({ accessToken: getJWT('access') })
    )
})


router.post('/logout', (req, res, next) => {
    res.clearCookie("refreshToken").send()
})

module.exports = router