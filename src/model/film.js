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

filmSchema.methods.toJSON = function () {
	const filmObject = this.toObject()
	delete filmObject.imageUrl
	delete filmObject.endpoint
	delete filmObject.image
	return filmObject
}

const Film = mongoose.model('Film', filmSchema)


module.exports = Film