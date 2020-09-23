var express = require("express")
var request = require("request")

var router = express.Router()

var Movie = require("../models/movies")

// INDEX ROUTES
router.get("/movies/:page",function(req,res){
	Movie.find({},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			var page  = req.params.page
			var type = 0
			var start = (page-1)*18
			var end   = start+19
			var x = allMovies.slice(start,end)
			if(allMovies.length<=start){
				res.send("Page not found")
			}else{
				var onlyPage = 0
				if(allMovies.length<=18){
					onlyPage = 1
				}
				var totalPage = Math.floor(allMovies.length/18)
				if(allMovies.length%18){
					totalPage=totalPage+1
				}
				res.render("movies/index",{movies:x,page:page,onlyPage:onlyPage,totalPage:totalPage,type:type})
			}
			
		}
	}).sort({createdAt:1})
})


// SHOW ROUTES
router.get("/movies/show/:id",function(req,res){
	Movie.findById(req.params.id).populate("comments").exec(function(err,movie){
		if(err){
			console.log(err)
		}else{
			request("http://www.omdbapi.com/?t="+movie.name+"&plot=full&apikey=thewdb",function(error,response,body){
				if(!error && response.statusCode === 200){
					var data = JSON.parse(body)
					res.render("movies/show",{movie:movie,data:data,id:req.params.id})		
				}
			})
		}
	})
})


//NEW ROUTES
router.get("/movie/new",function(req,res){
	res.render("movies/new")
})

router.post("/movies",function(req,res){

	var newMovie = {
		name        : req.body.name,
		quality     : req.body.quality,
		trailer     : req.body.trailer,
		poster      : req.body.poster,
		screenshots : req.body.screenshots,
		size        : req.body.size,
		link1       : req.body.link1,
		link2       : req.body.link2,
		link3       : req.body.link3,
		torrent     : req.body.torrent,
		type        : req.body.type
	}
	Movie.create(newMovie,function(err,movie){
		if(err){
			console.log(err)
		}else{
			console.log(movie)
			req.flash("success","Successfully Added Movie")
			res.redirect("/movies/1")
		}
	})
})

//EDIT ROUTES
router.get("/movies/:id/edit",checkAdmin,function(req,res){
	Movie.findById(req.params.id,function(err,movie){
		res.render("movies/edit",{movie:movie})
	})
})

router.post("/movies/:id/edit",checkAdmin,function(req,res){
	var movie = {
		name        : req.body.name,
		quality     : req.body.quality,
		trailer     : req.body.trailer,
		poster      : req.body.poster,
		screenshots : req.body.screenshots,
		size        : req.body.size,
		link1       : req.body.link1,
		link2       : req.body.link2,
		link3       : req.body.link3,
		torrent     : req.body.torrent,
		type        : req.body.type
	}
	Movie.findByIdAndUpdate(req.params.id,movie,function(err,updatedMovie){
		if(err){
			res.redirect("/")
		}else{
			req.flash("success","Edited Movie successfully")
			res.redirect("/movies/show/"+req.params.id)
		}
	})
})

// DELETE ROUTES
router.post("/movies/:id/delete",checkAdmin,function(req,res){
	Movie.findByIdAndRemove(req.params.id,function(err,movie){
		if(err){
			console.log(err)
			res.redirect("back")
		}else{
			req.flash("success","Deleted Movie Successfully")
			console.log("Movie Deleted Successfully")
			res.redirect("/movies/1")
		}
	})
})

// PUNJABI MOVIES
router.get("/movies/punjabi/:page",function(req,res){
	Movie.find({type:"punjabi"},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			var page  = Number(req.params.page)
			var type  = "punjabi"
			var start = (page-1)*18
			var end   = start+19
			var x = allMovies.slice(start,end)
			if(allMovies.length<=start){
				res.send("Page not found")
			}else{
				var onlyPage = 0
				if(allMovies.length<=18){
					onlyPage = 1
				}
				var totalPage = Math.floor(allMovies.length/18)
				if(allMovies.length%18){
					totalPage=totalPage+1
				}
				res.render("movies/index",{movies:x,page:page,onlyPage:onlyPage,totalPage:totalPage,type:type})
			}	
		}
	}).sort({createdAt:-1})
})


//BOLLYWOOD MOVIES
router.get("/movies/bollywood/:page",function(req,res){
	Movie.find({type:"bollywood"},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			var page  = Number(req.params.page)
			var type  = "bollywood"	
			var start = (page-1)*18
			var end   = start+19
			var x = allMovies.slice(start,end)
			if(allMovies.length<=start){
				res.send("Page not found")
			}else{
				var onlyPage = 0
				if(allMovies.length<=18){
					onlyPage = 1
				}
				var totalPage = Math.floor(allMovies.length/18)
				if(allMovies.length%18){
					totalPage=totalPage+1
				}
				console.log(x)
				console.log(totalPage)
				res.render("movies/index",{movies:x,page:page,onlyPage:onlyPage,totalPage:totalPage,type:type})
			}	
		}
	}).sort({createdAt:-1})
})

//HOLLYWOOD MOVIES
router.get("/movies/hollywood/:page",function(req,res){
	Movie.find({type:"hollywood"},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			var page  = Number(req.params.page)
			var type="hollywood"
			var start = (page-1)*18
			var end   = start+19
			var x = allMovies.slice(start,end)
			if(allMovies.length<=start){
				res.send("Page not found")
			}else{
				var onlyPage = 0
				if(allMovies.length<=18){
					onlyPage = 1
				}
				var totalPage = Math.floor(allMovies.length/18)
				if(allMovies.length%18){
					totalPage=totalPage+1
				}
				res.render("movies/index",{movies:x,page:page,onlyPage:onlyPage,totalPage:totalPage,type:type})
			}	
		}
	}).sort({createdAt:-1})
})

// ANIMATED MOVIES
router.get("/movies/animated/:page",function(req,res){
	Movie.find({type:"animated"},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			var page  = Number(req.params.page)
			var type  = "animated"
			var start = (page-1)*18
			var end   = start+19
			var x = allMovies.slice(start,end)
			if(allMovies.length<=start){
				res.send("Page not found")
			}else{
				var onlyPage = 0
				if(allMovies.length<=18){
					onlyPage = 1
				}
				var totalPage = Math.floor(allMovies.length/18)
				if(allMovies.length%18){
					totalPage=totalPage+1
				}
				res.render("movies/index",{movies:x,page:page,onlyPage:onlyPage,totalPage:totalPage,type:type})
			}	
		}
	}).sort({createdAt:-1})
})


// SEARCH ROUTES
router.post("/search",function(req,res){
	var str = req.body.search
	str=str.toLowerCase()
	console.log(str)
	str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
	var query = str.join(" ")
	console.log(query)
	Movie.find({name:query},function(err,allMovies){
		if(err){
			console.log(err)
		}else{
			res.render("movies/search",{movies:allMovies})
		}
	})
})




function checkAdmin(req,res,next){
	if(req.isAuthenticated()){
		if(req.user.isAdmin){
			next()
		}else{
			req.flash("error","You don't have permission to do that")
			res.redirect("back")
		}		
	}else{
		req.flash("error","You need to be signed-in to do that")
		res.redirect("/signin")
	}
}



module.exports = router