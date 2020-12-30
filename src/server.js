//Library
const express = require('express')
const app = express();
//Router
const indexRouter = require('./routes/index')
const voucherRouter = require('./routes/voucher')
const accountRouter = require('./routes/account')
const logRouter = require('./routes/log')
const codeDefinitionRouter = require('./routes/codedefinition')
//Environment
const port = process.env.port
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(indexRouter)
app.use('/voucher',voucherRouter)
app.use('/account',accountRouter)
app.use('/log',logRouter)
app.use('/codedefinition',codeDefinitionRouter)

app.listen(port,()=> {
    console.log('Server is running on port '+ port);
})

module.exports = app

