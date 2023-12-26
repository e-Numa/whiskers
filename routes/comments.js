const express = require("express"),
    router  = express.Router({mergeParams: true}),
    Pet = require("../models/pet"),
    Comment = require("../models/comment"),
    middleware = require("../middlewares");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, foundPet){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {pet: foundPet});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    Pet.findById(req.params.id, function(err, pet){
        if(err){
            req.flash("error", "Pet not found");
            res.redirect("/pets");
        } else {
            Comment.create(req.body.comments, function(err, comment){
                if(err){
                    req.flash("error", "Comment couldn't be added");
                    res.redirect("back");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    pet.comments.push(comment);
                    pet.save();
                    req.flash("success", "Comment was added successfully");
                    res.redirect("/pets/" + pet._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {pet_id : req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment){
        if(err){
            req.flash("error", "Comment couldn't be updated");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/pets/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Comment couldn't be deleted");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/pets/" + req.params.id);
        }
    });
});

module.exports = router;
