var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
var mongoose=require("mongoose");

mongoose.set('useFindAndModify', false);

router.get("/",function(req,res){
	
	Campground.find({},function(err,allcampground){
		if(err)
		{
			console.log(err);	
		}
		else{
			res.render("campgrounds/campgrounds",{campgrounds:allcampground});
		}
	});
	
});

router.post("/",middleware.isLoggedIn,function(req,res){
	let name=req.body.name;
	let image=req.body.image;
	let description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	let newbackground={name:name,image:image,description:description,author:author};
	//creating new campground here
	
	Campground.create(newbackground,function(err,newlycreated){
		if(err){
			console.log(err);
		}
		else{
			console.log(newlycreated);
			res.redirect("/campgrounds");
		}
	});
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
	
});

//edit campground route

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit.ejs",{campground:foundCampground});
	});
});

//update campground route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
});

//deleting a campground
router.delete("/:id",middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});


module.exports=router;
