const {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
} = require('./customerQueries.js')
const {
    validateId,
    validatePost,
    validatePut
} = require('./customerValidation.js')
const express = require('express')
const router = express.Router()

const notFoundErr = (res) => res.status(404).send('Customer not found.')
const joiErr = (res, err) => res.status(400).send(err.details[0].message)
const dbErr = (res, err) => res.status(400).send(err.toString())

router.use('/:id', (req, res, next) => {
    const { error } = validateId(req.params)
    if (error) return joiErr(res, error)
    next()
})

router.get('/:id', (req, res) => {
    getCustomer(req.params.id)
        .then(data => data.length == 0 ? notFoundErr(res) : res.send(data[0]))
        .catch(err => dbErr(res, err))
})

router.delete('/:id', (req, res) => {
    deleteCustomer(req.params.id)
        .then(data => data.rowCount == 0 ? notFoundErr(res) : res.send())
        .catch(err => dbErr(res, err))
})

router.post('/', (req, res) => {
    const { error } = validatePost(req.body)
    if (error) return joiErr(res, error)
    insertCustomer(req.body)
        .then(data => res.send(data[0]))
        .catch(err => dbErr(res, err))
})

router.put('/:id', (req, res) => {
    const { error } = validatePut(req.body)
    if (error) return joiErr(res, error)
    updateCustomer(req.params.id, req.body)
        .then(data => data.rowCount == 0 ? notFoundErr(res) : res.send())
        .catch(err => dbErr(res, err))
})

module.exports = router