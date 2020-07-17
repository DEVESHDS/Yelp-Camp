
var Campground=require("../models/campground");
var Comment=require("../models/comment");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
	
	if(req.isAuthenticated()){
	//does the user own the campground

		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","CAMPGROUND CANNOT BE FOUND");
				res.redirect("back");
			}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();	
				}else{
					req.flash("error","YOU DON'T HAVE PERMISSION TO DO THAT");
					res.redirect("back");
				}

			}
		});

	}else{
		req.flash("error","YOU NEED TO LOGIN FIRST");
		res.redirect("back");
	}

}

middlewareObj.checkCommentOwnership=function(req,res,next){
	
	
	if(req.isAuthenticated()){
	//does the user own the comment

		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();	
				}else{
					req.flash("error","YOU DON'T HAVE PERMISSION TO DO THAT");
					res.redirect("back");
				}

			}
		});

	}else{
		req.flash("error","YOU NEED TO LOGIN FIRST");
		res.redirect("back");
	}

}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","YOU NEED TO LOGIN FIRST");
	res.redirect("/login");
}

	

module.exports=middlewareObj;