const {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
} = require('../db/customerQueries.js')
const {
    validateId,
    validatePost,
    validatePut
} = require('../joiValidation.js')
const express = require('express')
const router = express.Router()

const notFoundErr = (res) => res.status(404).send('Customer not found.')
const joiErr = (res, err) => res.status(400).send(err.details[0].message)
const dbErr = (res, err) => res.status(400).send(err.toString())

router.get('/:id', (req, res) => {
    const { error } = validateId(req.params)
    if (error) return joiErr(res, error)
    getCustomer(req.params.id)
        .then(data => data.length == 0 ? notFoundErr(res) : res.send(data[0]))
        .catch(err => dbErr(res, err))
})

router.delete('/:id', (req, res) => {
    const { error } = validateId(req.params)
    if (error) return joiErr(res, error)
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
    const { error: idError } = validateId(req.params)
    const { error: putError } = validatePut(req.body)
    if (idError || putError) return joiErr(res, idError || putError)
    updateCustomer(req.params.id, req.body)
        .then(data => data.rowCount == 0 ? notFoundErr(res) : res.send())
        .catch(err => dbErr(res, err))
})

module.exports = router