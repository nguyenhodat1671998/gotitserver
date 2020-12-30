const mongoose = require('mongoose')

const codeDefinitionSchema = new mongoose.Schema({
    type: {
        type:String,
        default: true
    },
    value: {
        type:String,
    },
    code: {
        type:String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
timestamps: true
})


const CodeDefinition = mongoose.model('codedefinition',codeDefinitionSchema)
module.exports = CodeDefinition