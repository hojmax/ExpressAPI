const {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
} = require('./queries.js')
const {
    validateId,
    validatePost,
    validatePut
} = require('./validation.js')
const {
    joiMiddleware,
    jwtMiddleware
} = require('../middleware.js')
const router = require('express').Router()

const notFoundErr = { message: 'Customer not found', status: 404 }

router.use('/', jwtMiddleware)
router.use('/:id', joiMiddleware(validateId, 'params'))

router.get('/:id', (req, res, next) => {
    getCustomer(req.params.id)
        .then(data => data.length == 0 ? next(notFoundErr) : res.send(data[0]))
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    deleteCustomer(req.params.id)
        .then(data => data.rowCount == 0 ? next(notFoundErr) : res.send('Success'))
        .catch(next)
})

router.post('/', joiMiddleware(validatePost, 'body'), (req, res, next) => {
    insertCustomer(req.body)
        .then(data => res.send(data[0]))
        .catch(next)
})

router.put('/:id', joiMiddleware(validatePut, 'body'), (req, res, next) => {
    updateCustomer(req.params.id, req.body)
        .then(data => data.rowCount == 0 ? next(notFoundErr) : res.send('Success'))
        .catch(next)
})

module.exports = router