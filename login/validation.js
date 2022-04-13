const Joi = require('joi')

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
})

const validateLogin = data => loginSchema.validate(data)

module.exports = { validateLogin }