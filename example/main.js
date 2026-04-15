'use strict'

const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

require('dotenv').config()

// routes
const indexRoutes = require('./routes/index')
const webhooksRoutes = require('./routes/webhooks')
const stkRoutes = require('./routes/stk')
const externalRecipientRoutes = require('./routes/externalrecipient')
const transferRoutes = require('./routes/transfer')
const pollingRoutes = require('./routes/polling')
const tokenRoutes = require('./routes/tokenmanagement')
const sendMoneyRoutes = require('./routes/send_money')
const paymentLinkRoutes = require('./routes/payment_links')
const reversalsRoutes = require('./routes/reversals')

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
)
app.use('/favicon.ico', express.static('/favicon.ico'))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use('/', indexRoutes)
app.use('/webhook', webhooksRoutes)
app.use('/stk', stkRoutes)
app.use('/externalrecipient', externalRecipientRoutes)
app.use('/transfer', transferRoutes)
app.use('/polling', pollingRoutes)
app.use('/token', tokenRoutes)
app.use('/sendmoney', sendMoneyRoutes)
app.use('/paymentlink', paymentLinkRoutes)
app.use('/reversals', reversalsRoutes)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error', { title: 'There was an error' })
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
