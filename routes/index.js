// ===============
// BASIC ROUTES
// ===============

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


// AUTHENTICATION ROUTES

// Show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", function(req, res){
    // Add new user to the database
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        // Once added, go to Campgrounds page
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

// Handle login logic
// command:  router.post("login", middleware, callback)
// Use the middleware to verify that the user exists and route appropriately
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// Handle logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;