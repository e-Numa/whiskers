const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    petName: String,
    parentName: String,
    petAge: String, // It's kept as String to handle variations like "15 weeks"
    description: String,
    imageUrl: String,
    price: String, // If applicable, otherwise you can change it to a more suitable type
    // ... other fields or modifications as needed
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Pet", petSchema);