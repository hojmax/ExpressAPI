const Joi = require('joi')

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required(),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
})

module.exports = {
    validateLogin: data => loginSchema.validate(data)
}