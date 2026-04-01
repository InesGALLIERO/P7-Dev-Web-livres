const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },

    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true }

        }
    ],
    averageRating: { type: Number, default: 0 }

});

module.exports = mongoose.model('Book', bookSchema);