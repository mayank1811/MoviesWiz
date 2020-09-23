var express = require("express")

var router = express.Router()

var Comment = require("../models/comment")
var Movies = require("../models/movies")

router.post("/movies/:id/comment",isLoggedIn,function(req,res){
	var newComment = {
		text : req.body.comment
	}
	Movies.findById(req.params.id,function(err,foundMovie){
		if(err){
			console.log(err)
		}else{
			Comment.create(newComment,function(err,comment){
				if(err){
					console.log(err)
				}else{
					if(req.user.isAdmin){
						comment.author.username="Admin"
					}else{
						comment.author.username=req.user.username
					}
					comment.author.id = req.user._id
					
					comment.save()
					foundMovie.comments.push(comment)
					foundMovie.save(res.redirect("/movies/show/"+req.params.id))
				}
			})
		}
	})
})

// DELETE ROUTES

router.post("/movies/:id/comments/:cid/delete",function(req,res){
	Comment.findByIdAndRemove(req.params.cid,function(err){
		if(err){
			console.log(err)
		}else{
			req.flash("success","Comment deleted")
			res.redirect("back")
		}
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","You need to be signed-in to do that")
	res.redirect("/signin")
}

function checkCommentUser(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.cid,function(err,comment){
			if(err){
				console.log(err)
				res.redirect("back")
			}else{
				if(comment.author.id.equals(req.user._id)){
					next()
				}else{
					req.flash("error","You don't have permission to do that")
					res.redirect("back")
				}
			}
		})		
	}else{
		req.flash("error","You need to be signed-in to do that")
		res.redirect("back")
	}
}



module.exports = router