const express = require('express')
const app = express()
const port = process.env.PORT 
const puppeteer = require('puppeteer')


app.get('/', async (req, res) => {

	try {
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		})

		const page = await browser.newPage()
		await page.goto('https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md', {
			waitUntil: ['domcontentloaded', 'networkidle0']
		})
		console.log("hello")

		const title = await page.evaluate(() => {
			let title = document.querySelector('h1')
			return title.textContent
		})
		console.log(title)

		res.send(title)
		return await browser.close()

	} catch (e) {
		res.status(500).send(e)
	}	

})

app.listen(port, () => {
	console.log("Sever is now available at " + port)
})












// require('./db/mongoose')
// const Film = require('./model/film')
// const cron = require('./cronjob/cron')
// const filmContentCrawler = require('./crawler/crawler')