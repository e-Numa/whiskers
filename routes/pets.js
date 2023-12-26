const express = require("express"),
    router = express.Router(),
    Pet = require("../models/pet"),
    middleware = require("../middlewares");

// Index Route - Show all Pets
router.get("/", function(req, res){
    Pet.find({}, function(err, allPets){
        if(err){
            req.flash("error", "Error fetching pets");
            res.redirect("back");
        } else {
            res.render("pets/index", {pets: allPets, currentUser: req.user});
        }
    });
});

// Create Route - Add a new Pet
router.post("/", middleware.isLoggedIn, function(req, res){
    const petName = req.body.petName;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const reasonForSurrender = req.body.reasonForSurrender;
    const surrenderPrice = req.body.surrenderPrice;

    // Basic validation
    if (!petName || !imageUrl || !description) {
        req.flash("error", "Please fill in all required fields");
        return res.redirect("back");
    }

    const newPet = {
        petName: petName,
        imageUrl: imageUrl,
        description: description,
        author: author,
        reasonForSurrender: reasonForSurrender,
        surrenderPrice: surrenderPrice
    };

    Pet.create(newPet, function(err, newlyCreatedPet){
        if(err){
            req.flash("error", "Error creating a new pet");
            res.redirect("back");
        } else {
            req.flash("success", "Pet was created successfully");
            res.redirect("/pets");
        }
    });
});

// New Route - Show form to create a new Pet
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("pets/new");
});

// Show Route - Display details of a specific Pet
router.get("/:id", function(req, res){
    Pet.findById(req.params.id).populate("comments").exec(function(err, foundPet){
        if(err || !foundPet){
            req.flash("error", "Pet not found");
            res.redirect("back");
        } else {
            res.render("pets/show", {pet: foundPet});
        }
    });
});

// Edit Route - Show form to edit a Pet
router.get("/:id/edit", middleware.checkPetOwnership, function(req, res){
    Pet.findById(req.params.id, function(err, foundPet){
        if(err || !foundPet){
            req.flash("error", "Pet not found");
            res.redirect("back");
        } else {
            res.render("pets/edit", {pet: foundPet});
        }
    });
});

// Update Route - Update a Pet
router.put("/:id", middleware.checkPetOwnership, function(req, res){
    Pet.findByIdAndUpdate(req.params.id, req.body.pet, function(err, updatedPet){
        if(err || !updatedPet){
            req.flash("error", "Error updating the pet");
            res.redirect("/pets");
        } else {
            req.flash("success", "Pet was updated successfully");
            res.redirect("/pets/" + req.params.id);
        }
    });
});

// Destroy Route - Delete a Pet
router.delete("/:id", middleware.checkPetOwnership, function(req, res){
    Pet.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Error deleting the pet");
            res.redirect("/pets");
        } else {
            req.flash("success", "Pet was deleted successfully");
            res.redirect("/pets");
        }
    });
});

module.exports = router;
