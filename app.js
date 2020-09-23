var express        = require("express"),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	passport       = require("passport"),
	localStrategy  = require("passport-local"),
	expressSession = require("express-session"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash"),
	request        = require("request"),
	moment         = require("moment"),
	MongoStore     = require("connect-mongo")(expressSession)


var Movie   = require("./models/movies"),
	Comment = require("./models/comment"),
	Request = require("./models/request"),
	User    = require("./models/user")

var commentRoutes   = require("./routes/comments"),
	indexRoutes     = require("./routes/index"),
	movieRoutes  = require("./routes/movie")
	

var app = express()

mongoose.connect("mongodb+srv://Mayank:mickeymouse@6847@cluster0.gapgw.mongodb.net/movieswiz?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useUnifiedTopology:true
})

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")

//passport config
app.use(expressSession({
	store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'session',
      }),
	secret: "My name is Mayank",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.locals.moment = require("moment")

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(function(req,res,next){
	res.locals.currentUser = req.user
	res.locals.error=req.flash("error")
	res.locals.success=req.flash("success")
	next()
})

app.use(commentRoutes)
app.use(indexRoutes)
app.use(movieRoutes)

app.listen(process.env.PORT,process.env.ID,function(){
	console.log("Server has started")
})