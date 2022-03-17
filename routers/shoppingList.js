const express = require('express')
const schmema = require('../Joi.js')
const router = express.Router()
const Message = require('../schemas/Message.js')
let shoppingList = []


router.get('/all', (req, res) => {
    Message.find({})
        .then(data => res.send(data))
        .catch(err => res.status(400).send(err))
})

router.post('/', (req, res) => {
    if (schmema(req.body).error) return res.status(400).send()
    const instance = new Message(req.body);
    instance.save()
        .then(() => res.status(200).send())
        .catch(() => res.status(400).send(err))
})

router.delete('/all', (req, res) => {
    shoppingList = []
    res.send()
})

router.put('/:id', (req, res) => {
    const { error } = schmema(req.body)
    if (error) {
        res.status(400).send()
    } else {
        let index = shoppingList.findIndex(x => x.id == req.params.id)
        if (index !== -1) {
            shoppingList[index] = req.body
            res.send(shoppingList[index])
        } else {
            res.status(404).send()
        }
    }
})

router.get('/:id', (req, res) => {
    let index = shoppingList.findIndex(x => x.id == req.params.id)
    if (index !== -1) {
        res.send(shoppingList[index])
    } else {
        res.status(404).send()
    }
})

module.exports = router