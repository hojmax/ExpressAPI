const Joi = require('joi')

const idSchema = Joi.object({
    id: Joi.number()
        .integer()
        .required(),
})

const first_name = Joi.string()
    .max(255)
const last_name = Joi.string()
    .max(255)
const email = Joi.string()
    .email()
    .max(255)
const phone = Joi.string()
    .max(25)
const city = Joi.string()
    .max(50)
const state = Joi.string()
    .max(25)
const street = Joi.string()
    .max(255)
const zip_code = Joi.string()
    .max(5)

const postSchema = Joi.object({
    first_name: first_name.required(),
    last_name: last_name.required(),
    email: email.required(),
    phone,
    city,
    street,
    state,
    zip_code,
})

const putSchema = Joi.object({
    first_name,
    last_name,
    email,
    phone,
    city,
    street,
    state,
    zip_code,
})

module.exports = {
    validateId: data => idSchema.validate(data),
    validatePost: data => postSchema.validate(data),
    validatePut: data => putSchema.validate(data)
}