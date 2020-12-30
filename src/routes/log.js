require('../db/mongoose')
//Server
const express = require('express')
//Model
const Log = require('../model/log')
//Router
const router = new express.Router()

router.get('/list/:id', async (req, res) => {
    try {
        const log = await Log.find({userid:req.params.id})
        if (log.length>0)
            res.status(200).send({Logs:log})
        else
            res.status(404).send({Message: "There are no logs for this account"})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router