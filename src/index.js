const express = require('express')
const app = express()
const port = process.env.PORT 
const puppeteer = require('puppeteer-core')


app.get('/', async (req, res) => {

	try {
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		})

		const page = await browser.newPage()
		await page.goto('https://fimfast.com/phim-le', {
			waitUntil: ['domcontentloaded', 'networkidle0']
		})

		
		//Turn off the popup form
		const frameSelector = await page.$('#ur-render-target')
		if (frameSelector) {
			const frame = await frameSelector.contentFrame()
			const but = await frame.$('#btn-reject')
			await but.click()
		}


		const films = await page.evaluate(() => {
			let filmEndpointList = document.querySelectorAll('.tray-item > a')
			let filmQualityList = document.querySelectorAll('.tray-item-quality')
			let filmTitleList = document.querySelectorAll('.tray-item-title')
			let filmDurationList = document.querySelectorAll('.tray-item-title')
			let filmPointList = document.querySelectorAll('.tray-item-point')
			let filmImageUrl = document.querySelectorAll('.tray-item-thumbnail')

			filmPointList = [...filmPointList]
			filmEndpointList = [...filmEndpointList]
			filmQualityList = [...filmQualityList]
			filmDurationList = [...filmDurationList]
			filmTitleList = [...filmTitleList]
			filmImageUrl = [...filmImageUrl]
		
			const films = filmTitleList.map((filmTitle, index) => {
				return {
					title: filmTitle.textContent,
					point: filmPointList[index] !== undefined? filmPointList[index].textContent: undefined,
					quality: filmQualityList[index].textContent,
					duration: filmDurationList[index].textContent,
					endpoint: filmEndpointList[index].getAttribute('href'),
					imageUrl: filmImageUrl[index].getAttribute('src')
				}
			})
			
			return films
		})


		console.log(films.length)
		res.send(films)
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