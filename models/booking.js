const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending','cancelled','confirmed','completed'], default: 'pending' },
}, { timestamps: true })

const Booking = mongoose.model('Booking', BookingSchema)

module.exports = Booking