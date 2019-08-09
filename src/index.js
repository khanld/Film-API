const express = require('express')
const app = express()
require('./db/mongoose')
const Film = require('./model/film')
const port = process.env.PORT 
const cron = require('./cronjob/cron')
const filmContentCrawler = require('./crawler/crawler')



app.get('/', async (req, res) => {
	await filmContentCrawler()
	const films  = await Film.find({})
	res.send(films)
})

app.listen(port, () => {
	console.log("Sever is now available at " + port)
})


