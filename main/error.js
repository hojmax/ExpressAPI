module.exports = {
    loginError: {
        message: 'Invalid email or password',
        status: 403
    },
    notFoundError: {
        message: 'Customer not found',
        status: 404
    },
    joiError: err => ({
        message: err.details[0].message,
        status: 400
    }),
    invalidTokenError: {
        message: 'Invalid token',
        status: 403
    },
    missingTokenError: {
        message: 'Missing token',
        status: 401
    },
}