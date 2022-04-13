const joiMiddleware = (schema, property) => (req, res, next) => {
    const { error } = schema(req[property])
    next(error && {
        message: error.details[0].message,
        status: 400
    })
}

const errorMiddleware = (err, req, res, next) => res.status(err.status || 500).send(err.message)

module.exports = { joiMiddleware, errorMiddleware }