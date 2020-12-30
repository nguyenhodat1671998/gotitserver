const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const accountSchema = new mongoose.Schema({
    phonenumber: {
        type:String,
        required:true
    },
    fullname:{
        type: String,
        default:""
    },
    birthday: {
        type:Date,
        default:"1/1/1900"
    },
    gender: {
        type:Boolean,
        default:false
    },
    balance: {
        type:Number,
        default: 0
    },
    password: {
        type: String,
        required:true,
        trim: true,
        minlength:6,
        validate(value) {
            if(!value.match("(?=.*[a-z])")) {
                throw new Error('password must contain at least 1 lowercase character')
            }
            if(!value.match("(?=.*[A-Z])")) {
                throw new Error('password must contain at least 1 uppercase character')
            }
            if(!value.match("(?=.*[0-9])")) {
                throw new Error('password must contain at least 1 numeric character')
            }
            if(!value.match("(?=.[!@#\$%\^&])")) {
                throw new Error('password must contain at least 1 special character')
            }
        }
    },
    vouchers: [{
        voucher:{
            type: mongoose.Schema.Types.ObjectId
        },
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
timestamps: true
})
accountSchema.methods.generateAuthToken = async function () {

    const account = this 
    const token =jwt.sign({_id: account._id.toString()}, process.env.JWT_SECRET)
    if(!token) {
        throw new Error('Unable to generate token')
    }
    account.tokens = account.tokens.concat({token})
    await account.save()
    return token
}

accountSchema.methods.toJSON = function() {
    const account = this
    const accountObject = account.toObject()

    delete accountObject.password
    delete accountObject.tokens
    
    return accountObject
}

accountSchema.statics.findByCredentials = async(phonenumber,password) => {
    
    const account = await Account.findOne({phonenumber})
    if(!account) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,account.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    return account
}

accountSchema.pre('save',async function (next) {
    const account = this
    if (account.isModified('password')) {
        account.password = await bcrypt.hash(account.password,8)
    }
    next()
})

const Account = mongoose.model('account',accountSchema)
module.exports = Account