const Pet = require("../models/pet"),
    Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkPetOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Pet.findById(req.params.id, function(err, foundPet){
            if(err || !foundPet){
                req.flash("error", "Pet not found");
                res.redirect("/pets");
            } else {
                if(foundPet.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Permission not granted");
                    res.redirect("/pets");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!!!");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("/pets");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("Permission not granted");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!!!");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;
