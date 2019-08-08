const mongoose = require('mongoose')
//mongodb+srv://taskapp:unehihi12@cluster0-1zqtq.mongodb.net/webwraping?retryWrites=true&w=majority

mongoose.connect('mongodb://localhost:27017/film-api', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
})
