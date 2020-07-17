var express = require("express");
var app = express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var Campground=require("./models/campground.js");
var Comment=require("./models/comment");
var passport=require("passport");
var flash=require("connect-flash");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var seedDB=require("./seed");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
var Schema = mongoose.Schema;



///connecting mongoose here

mongoose.connect("mongodb+srv://yelpcamp:yelpcamp@cluster0.3ze9y.mongodb.net/<dbname>?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


///mongoose connect finish here
app.use(flash());

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");
app.use(methodOverride("_method"));

//seed db

//seedDB();

app.use(require("express-session")({
	secret:"once again rusty here",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(21312,function(){
	console.log("yelpcamp server has started");
});

