var express = require("express")

var router = express.Router()

var passport = require("passport")
var User = require("../models/user")
var Request = require("../models/request")


router.get("/",function(req,res){
	res.render("home")
})


// SIGN-UP
router.get("/signup",function(req,res){
	res.render("auth/signup")
})

router.post("/signup",function(req,res){
	var newUser = new User({username: req.body.username})
	if(req.body.adminCode === "secret_mayank"){
		newUser.isAdmin = true
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err)
			return res.render("signup")
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to MOVIESWIZ "+req.body.username)
			res.redirect("/movies/1")
		})
	})
})

//SIGN-IN
router.get("/signin",function(req,res){
	res.render("auth/signin")
})

router.post("/signin",passport.authenticate("local",
	{
		successRedirect: "/movies/1",
		failureRedirect: "/signin"
	}),function(req,res){
})

// SIGN-OUT
router.get("/signout",function(req,res){
	req.logout()
	req.flash("success","Logged you out")
	res.redirect("/movies/1")
})


//CONTACT
router.get("/contact",function(req,res){
	Request.find({},function(err,allRequests){
		if(err){
			console.log(err)
		}else{
			res.render("auth/contact",{requests:allRequests})
		}
	}).sort({createdAt:-1})
})

router.post("/contact",isLoggedIn,function(req,res){
	var newRequest = {
		text : req.body.request,
	}
	Request.create(newRequest,function(err,request){
		if(err){
			console.log(err)
		}else{
			if(req.user.isAdmin){
				request.author.username = "Admin"
			}else{
				request.author.username = req.user.username
			}
			request.author.id = req.user._id,
			request.save()
			res.redirect("/contact")
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


module.exports = router