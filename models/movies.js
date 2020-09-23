var mongoose = require("mongoose")

var movieSchema = new mongoose.Schema({
	type:String,
	name:String,
	quality:String,
	trailer:String,
	link1:String,
	link2:String,
	link3:String,
	torrent:String,
	size:String,
	poster:String,
	screenshots:String,
	type:String,
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	],
	createdAt:{
		type:Date,
		default:Date.now()
	}
})

module.exports = mongoose.model("movie",movieSchema)
