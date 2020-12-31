//Library
const express = require('express')
const app = express();
var cors = require('cors')
//Router
const indexRouter = require('./routes/index')
const voucherRouter = require('./routes/voucher')
const accountRouter = require('./routes/account')
const logRouter = require('./routes/log')
const codeDefinitionRouter = require('./routes/codedefinition')
//Environment
const port = process.env.PORT
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use(indexRouter)
app.use('/voucher',voucherRouter)
app.use('/account',accountRouter)
app.use('/log',logRouter)
app.use('/codedefinition',codeDefinitionRouter)

app.listen(port,()=> {
    console.log('Server is running on port '+ port);
})

module.exports = app

