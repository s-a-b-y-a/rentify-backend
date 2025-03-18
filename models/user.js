const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true })

const User = mongoose.model('User',UserSchema)

module.exports = User