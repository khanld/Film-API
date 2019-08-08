const express = require('express')
const app = express()
require('./db/mongoose')
const Film = require('./model/film')
const port = process.env.PORT 
const cron = require('./cronjob/cron')

cron.start()

app.get('/', async (req, res) => {
	const films  = await Film.find({})
	res.send(films)
})

app.listen(port, () => {
	console.log("Sever is now available at " + port)
})


