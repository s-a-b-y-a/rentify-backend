const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
    location: { 
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    availability: { type: Boolean, default: true },
    image: { type: String },
}, { timestamps: true })

const Car = mongoose.model('Car',CarSchema)

module.exports = Car