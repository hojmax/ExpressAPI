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
const express = require('express')
const router = express.Router()

const notFoundErr = res => res.status(404).send('Customer not found')
const joiErr = (res, err) => res.status(400).send(err.details[0].message)
const dbErr = (res, err) => res.status(500).send(err.toString())

const joiMiddleware = (schema, property) => (req, res, next) => {
    const { error } = schema(req[property])
    if (error) return joiErr(res, error)
    next()
}

router.use('/:id', joiMiddleware(validateId, 'params'))

router.get('/:id', (req, res) => {
    getCustomer(req.params.id)
        .then(data => data.length == 0 ? notFoundErr(res) : res.send(data[0]))
        .catch(err => dbErr(res, err))
})

router.delete('/:id', (req, res) => {
    deleteCustomer(req.params.id)
        .then(data => data.rowCount == 0 ? notFoundErr(res) : res.send('Success'))
        .catch(err => dbErr(res, err))
})

router.post('/', joiMiddleware(validatePost, 'body'), (req, res) => {
    insertCustomer(req.body)
        .then(data => res.send(data[0]))
        .catch(err => dbErr(res, err))
})

router.put('/:id', joiMiddleware(validatePut, 'body'), (req, res) => {
    updateCustomer(req.params.id, req.body)
        .then(data => data.rowCount == 0 ? notFoundErr(res) : res.send('Success'))
        .catch(err => dbErr(res, err))
})

module.exports = router