const Joi = require('joi')

const idSchema = Joi.object({
    id: Joi.number()
        .integer()
        .required(),
})

const postSchema = Joi.object({
    first_name: Joi.string()
        .max(255)
        .required(),
    last_name: Joi.string()
        .max(255)
        .required(),
    email: Joi.string()
        .email()
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

const putSchema = Joi.object({
    first_name: Joi.string()
        .max(255),
    last_name: Joi.string()
        .max(255),
    email: Joi.string()
        .max(255),
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
    validatePost: data => postSchema.validate(data),
    validatePut: data => putSchema.validate(data)
}