const Joi = require('joi')

const idSchema = Joi.object({
    id: Joi.number()
        .required(),
})

const customerSchema = Joi.object({
    first_name: Joi.string()
        .max(255)
        .required(),
    last_name: Joi.string()
        .max(255)
        .required(),
    email: Joi.string()
        .max(255)
        .required(),
    phone: Joi.string()
        .max(25),
    city: Joi.string()
        .max(50),
    street: Joi.string()
        .max(255),
    state: Joi.string()
        .max(25),
    zip_code: Joi.string()
        .max(5),
})

module.exports = {
    validateId: data => idSchema.validate(data),
    validateCustomer: data => customerSchema.validate(data)
}