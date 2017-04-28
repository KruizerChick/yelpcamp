// ALL MIDDLEWARE GOES HERE

// IMPORT MODULES
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// Verify that the user is the one who created the campground
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // If not, redirect
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
};

// Verify that the user is the one who created the comment
middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong.");
                res.redirect("back");
            } else {
                // Does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        // If not, redirect
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

// Verify that user is logged in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // Message if not authenticated (before redirect)
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;
