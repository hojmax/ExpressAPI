const Joi = require('joi');

const schema = Joi.object({
    message: Joi.string()
        .required(),
    senderId: Joi.number()
        .required(),
    recipientId: Joi.number()
        .required(),
})

const validate = (data) => schema.validate(data)

module.exports = validate