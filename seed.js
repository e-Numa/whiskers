const mongoose = require("mongoose");
const Pet = require("./models/pet");
const Comment = require("./models/comment");

const seeds = [
    {
        name: "Fluffy",
        imageUrl: "https://images.unsplash.com/photo-1620072888881-c0f56753769c?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A cute and playful pet.",
        age: "13 months",
        price: 43000,
        comments: [
            {
                text: "This pet is amazing!",
                author: "John Doe",
            },
            {
                text: "I would love to adopt this pet.",
                author: "Jane Smith",
            },
        ],
    },
    {
        name: "Moshs",
        imageUrl: "https://t4.ftcdn.net/jpg/02/24/14/19/360_F_224141924_9vIfCwjhTFm5TakjT1Zg7B7RUT39g1Kg.jpg",
        description: "Loves to cuddle and enjoys sunny spots.",
        age: "2 months",
        price: 38000,
        comments: [
            {
                text: "Such a lovely pet!",
                author: "Alice",
            },
        ],
    },
    // Add more pets as needed
];

function seedDB() {
    // Remove all pets and comments
    Pet.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed pets!");

        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("Removed comments!");

            // Add new pets and comments
            seeds.forEach(function (seed) {
                Pet.create(seed, function (err, pet) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a pet:", pet);

                        // Add comments to the pet
                        seed.comments.forEach(function (comment) {
                            Comment.create(comment, function (err, createdComment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    pet.comments.push(createdComment);
                                    pet.save();
                                    console.log("Created new comment");
                                }
                            });
                        });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;
