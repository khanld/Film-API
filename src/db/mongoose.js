const mongoose = require('mongoose')
//mongodb+srv://taskapp:unehihi12@cluster0-1zqtq.mongodb.net/webwraping?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://taskapp:unehihi12@cluster0-1zqtq.mongodb.net/film-api?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
})
