const express = require('express')
const {
    bookCar,
    getUserBookings,
    cancelBooking,
} = require('../controllers/booking')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, bookCar)
router.get('/', protect, getUserBookings)
router.put('/:id', protect, cancelBooking)

module.exports = router