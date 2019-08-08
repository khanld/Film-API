const mongoose = require('mongoose')
const filmSchema = mongoose.Schema({
	title: {
		type: String
	},
	point: {
		type: String
	},
	quality: {
		type: String
	},
	duration: {
		type: String
	},
	endpoint: {
		type: String
	},
	imageUrl:  {
		type: String
	},
	content:  {
		type: String
	},
	image: {
		type: Buffer
	}
})


const Film = mongoose.model('Film', filmSchema)


module.exports = Film