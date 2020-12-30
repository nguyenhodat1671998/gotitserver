require('../db/mongoose')
//Server
const express = require('express')
//Model
const Account = require('../model/account')
const Log = require('../model/log')
const Voucher = require('../model/voucher')
const CodeDefinition = require('../model/codedefinition')
//Router
const router = new express.Router()

router.post('/:id/buy', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id)
        //voucher requested from client
        const reqVoucher = req.body.voucher
        if (account.balance >= reqVoucher.value) {
            console.log(account.balance)
            
            //following code have to be generated to concatenate together for a unique code of each voucher
            //3 digits
            const brandCode = (await CodeDefinition.findOne({ type: 'brand', value: reqVoucher.brand })).code
            console.log(brandCode)
            //2 digits
            const valueCode = (await CodeDefinition.findOne({ type: 'value', value: reqVoucher.value })).code
            console.log(brandCode)
            //5 digits
            const countCode = await leftPad(await Voucher.estimatedDocumentCount(), 5)
            // Officially creating new voucher for using
            const voucher = new Voucher({   
                type: reqVoucher.type = "Barcode" ? true : false,
                description: "Use this voucher at any store of " + reqVoucher.brand,
                value: reqVoucher.value,
                brand: reqVoucher.brand,
                code: countCode + brandCode + valueCode
            })
            await voucher.save()

            //deduct money from the account balance after buying a voucher
            account.vouchers.push(voucher.id)
            account.balance -= reqVoucher.value
            await account.save()

            //loging the buying voucher activity
            const log = new Log({
                userid: account.id,
                activity: 'buy',
                voucherid: voucher.id,
                description: 'You bought voucher ' + reqVoucher.brand + ' ' + reqVoucher.value
            })
            await log.save()
            res.status(200).send({message:'Successfully buying voucher'})
        } else {
            res.status(400).send({message: "your balance is not enough for buying voucher"})
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:id', async(req,res) => {
    try {
        const voucher = await Voucher.findById(req.params.id)
        if(voucher)
            res.status(200).send(voucher)
        else
            res.status(404).send({error:"Cannot found voucher"})
    } catch (e) {
        res.status(400).send(e)
    }
})

async function leftPad(number, targetLength) {
    let output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
module.exports = router
