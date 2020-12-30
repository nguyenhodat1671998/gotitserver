const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
    type: {
        type:Boolean,
        default: true
    },
    description: {
        type:String
    },
    value:{
        type:Number
    },
    brand: {
        type:String
    },
    validto: {
        type:Date,
        default:Date.now()+30
    },
    code:{
        type:String
    },
    isUsed: {
        type:Boolean,
        default:false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
timestamps: true
})


const Voucher = mongoose.model('voucher',voucherSchema)
module.exports = Voucher