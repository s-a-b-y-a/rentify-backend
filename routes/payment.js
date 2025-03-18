const express = require('express')
const { initiatePayment, verifyPayment } = require('../controllers/payment')

const router = express.Router()

router.post('/order', initiatePayment)
router.post('/verify', verifyPayment)

module.exports = router