'use strict'

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

require('dotenv').load()

// routes
const indexRoutes = require('./routes/index')
const webhooksRoutes = require('./routes/webhooks')
const stkRoutes = require('./routes/stk')
const payRoutes = require('./routes/pay')
const transferRoutes = require('./routes/transfer')
const pollingRoutes = require('./routes/polling')
const smsNotificationRoutes = require('./routes/smsnotification')

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use('/favicon.ico', express.static('/favicon.ico'))

app.set('view engine', 'jade')

app.use('/', indexRoutes)
app.use('/webhook', webhooksRoutes)
app.use('/stk', stkRoutes)
app.use('/pay', payRoutes)
app.use('/transfer', transferRoutes)
app.use('/polling', pollingRoutes)
app.use('/smsnotification', smsNotificationRoutes)

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
	console.log(`App running on port ${ port }.`)
})
