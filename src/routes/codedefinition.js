//Server
const express = require('express')
//Model
const CodeDefinition = require('../model/codedefinition')
//Router
const router = new express.Router()

router.post('/new', async (req, res) => {
    const codeDefi = new CodeDefinition(req.body)
    try{
        await codeDefi.save()
        res.status(201).send({codeDefi})
    } catch(e) {
        res.status(400).send(e)
    }
})


module.exports = router
