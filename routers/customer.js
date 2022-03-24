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

const extractErr = err => err.details[0].message

router.get('/:id', (req, res) => {
    const { err } = validateId(req.params)
    if (err) return res.status(400).send(extractErr(err))
    getCustomer(req.params.id)
        .then(data => {
            if (data.length == 0) return res.status(404).send('Customer not found.')
            res.send(data[0])
        })
        .catch(err => res.status(400).send(err.toString()))
})

router.delete('/:id', (req, res) => {
    const { err } = validateId(req.params)
    if (err) return res.status(400).send(extractErr(err))
    deleteCustomer(req.params.id)
        .then(() => res.send())
        .catch(err => res.status(400).send(err.toString()))
})

router.post('/', (req, res) => {
    const { err } = validatePost(req.body)
    if (err) return res.status(400).send(extractErr(err))
    insertCustomer(req.body)
        .then(() => res.send())
        .catch(err => res.status(400).send(err.toString()))
})

router.put('/:id', (req, res) => {
    const { error: idError } = validateId(req.params)
    const { error: putError } = validatePut(req.body)
    if (idError) return res.status(400).send(extractErr(idError))
    if (putError) return res.status(400).send(extractErr(putError))
    updateCustomer(req.params.id, req.body)
        .then(() => res.send())
        .catch(err => res.status(400).send(err.toString()))
})

module.exports = router