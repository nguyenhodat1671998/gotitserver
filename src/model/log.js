const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'account'
    },
    activity: {
        type:String
    },
    voucherid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'voucher'
    },
    description: {
        type:String
    }
}, {
timestamps: true
})


const Log = mongoose.model('log',logSchema)
module.exports = Log