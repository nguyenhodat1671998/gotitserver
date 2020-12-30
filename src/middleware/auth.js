const jwt = require('jsonwebtoken')
const Account = require('../model/account')
const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const account = await Account.findOne({_id: decoded._id, 'tokens.token':token})
        if(!account) {
            throw new Error()
        }
        req.account = account
        req.token = token
        next()
    } catch(e) {
        res.status(401).send({error:"Please Authenticate!"})
    }
}

module.exports = auth