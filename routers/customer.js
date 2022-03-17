const {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
} = require('../db/db.js')
const {
    validateId,
    validatePost,
    validatePut
} = require('../Joi.js')
const express = require('express')
const router = express.Router()

const formatErr = (err) => err.details.map(e => e.message)

router.get('/:id', (req, res) => {
    const { error } = validateId(req.params)
    if (error) return res.status(400).send(formatErr(error))
    getCustomer(req.params.id)
        .then(data => {
            if (data.length == 0) res.status(404).send()
            else res.send(data)
        })
        .catch(err => res.status(400).send(err.toString()))
})

router.delete('/:id', (req, res) => {
    const { error } = validateId(req.params)
    if (error) return res.status(400).send(formatErr(error))
    deleteCustomer(req.params.id)
        .then(() => res.send('Success'))
        .catch(err => res.status(400).send(err.toString()))
})

router.post('/', (req, res) => {
    const { error } = validatePost(req.body)
    if (error) return res.status(400).send(formatErr(error))
    insertCustomer(req.body)
        .then(() => res.send('Success'))
        .catch(err => res.status(400).send(err.toString()))
})

router.put('/:id', (req, res) => {
    const idValidation = validateId(req.params)
    const putValidation = validatePut(req.body)
    if (idValidation.error) return res.status(400).send(formatErr(idValidation.error))
    if (putValidation.error) return res.status(400).send(formatErr(putValidation.error))
    updateCustomer(req.params.id, req.body)
        .then(() => res.send('Success'))
        .catch(err => res.status(400).send(err.toString()))
})

module.exports = router