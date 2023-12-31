const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Pet = require("../models/pet"),
    User = require("../models/user");

// Home Route
router.get("/", function(req, res){
    res.render("home");
});

// AUTH ROUTES
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Sign Up successful. Welcome " + req.body.username + "!!!");
            res.redirect("/pets");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/pets",
    failureRedirect: "/login"
}), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged you out");
    res.redirect("/pets");
});

module.exports = router;
