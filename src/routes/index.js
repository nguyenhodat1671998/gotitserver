//Server
const express = require('express')

//Router
const router = new express.Router()

router.get('/',(req,res) => {
    res.send({
        msg: 'PONG',
        server: 'gotit-voucher',
        uptime: process.uptime(),
    })
})

module.exports = router