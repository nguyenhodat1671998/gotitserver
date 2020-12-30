
//Server
const express = require('express')
//Model
const Account = require('../model/account')
const Log = require('../model/log')
//Router
const router = new express.Router()

router.post('/login', async (req, res) => {
    try {
        const account = await Account.findByCredentials(req.body.phone_number, req.body.password)
        const token = await account.generateAuthToken()
        res.status(200).send({account, token})
    } catch (e) {
        res.status(400).send(e);
    }

})

router.post('/logout', async (req, res) => {
    try {
        req.account.tokens = req.account.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.account.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/signup', async (req, res) => {
    const account = new Account(req.body)
    try {
        await account.save()
        res.status(201).send({ account })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/topup', async (req, res) => {
    try {
        const account = await Account.findById(req.body.account_id)
        account.balance += req.body.extra_money
        await account.save()

        const log = new Log({
            userid: req.body.account_id,
            activity: "Topup",
            description: "You added " + req.body.extra_money + "VND to wallet"
        })
        await log.save()
        res.status(200).send({ Message: "Successfully Topup" })
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/changepass', async(req,res) => {
    try {
        console.log(req.body)
        const account = await Account.findByCredentials(req.body.phone_number, req.body.password)
        
        account.password = req.body.new_password
       
        await account.save()
        res.status(200).send({Message:"Successfully changing password"})
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/info/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id)
        if (account)
            res.status(200).send(account)
        else
            res.status(404).send({Message: "Cannot Found Info"})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/updateinfo/:id', async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['phonenumber','fullname','birthday','gender']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid account updates!'})
    }
    try { 
        const account = await Account.findById(req.params.id)
        updates.forEach((update) => account[update] = req.body[update])
        await account.save()
        if(!account) {
            return res.status(404).send()
        }
        res.send(account)
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router