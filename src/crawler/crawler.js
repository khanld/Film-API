const puppeteer = require('puppeteer')
const request = require('request')
require('../db/mongoose')
const Film = require('../model/film')

const filmImageCrawler = (film) => {
	return request({
		url: film.imageUrl,
		encoding: null
	}, (error, response, body) => {
		film.image = body
	})
}

const filmContentCrawler = async () => {
	try {
			await Film.deleteMany()
			const browser = await puppeteer.launch({
			headless: true, 
			defaultViewport: {
				width: 1280,
				height: 568
			},
			args: [ '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process']
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
		
		
		
		const goEachFilmPage = (film) => {
			return new Promise( async resolve => {
				const page = await browser.newPage()
				await page.goto(`https://fimfast.com/${film.endpoint}`,{
				waitUntil: ['domcontentloaded', 'networkidle0']})
				
				film.content = await page.evaluate(() => {
				return document.querySelector('.film-info-description').textContent
			})

				film.content = film.content.replace(/\n|\\/g, '')


				return resolve()
			})
		}

		//Expading the film list
		// var moreBut = await page.$('.tray-more')	
		// await new Promise((resolve, reject) => {
		// 	let i =0;
		// 	const interval = setInterval(async ()=> {

		// 		if(i === 2) {
		// 			resolve("done")
		// 			return clearInterval(interval)
		// 		}

		// 		moreBut.click()
		// 		i++
		// 	}, 3000)
		// })

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

		
		const filmsPromise = films.map((film) => {
			 return goEachFilmPage(film)
		})

		films.forEach((film) => {
			filmImageCrawler(film)
		})
		await Promise.all(filmsPromise)
		films.forEach(async film => {
			await new Film(film).save()
		})


		await browser.close()

	} catch (e) {
		console.log(e)
	}	

}
console.log("hello")
filmContentCrawler()

module.exports = filmContentCrawler