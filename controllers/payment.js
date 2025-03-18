const crypto = require('crypto')
const razorpay = require('../config/razorpay')
const Booking = require('../models/booking')

exports.initiatePayment = async (req,res) => {
    const { bookingId } = req.body
    try {
        const booking = await Booking.findById(bookingId).populate('car')
        if(!booking) return res.status(404).json({ message: 'Booking not found!' })

        const options = {
            amount: booking.totalPrice*100,
            currency: "INR",
            receipt: booking._id.toString(),
            payment_capture: 1,
            notes: {
                bookingId: booking._id.toString(),
            }
        }    

        const order = await razorpay.orders.create(options)

        return res.status(200).json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Payment initiation failed!', error })
    }
}

exports.verifyPayment = async (req,res) => {
    const { rzp_order_id, rzp_payment_id, rzp_signature } = req.body
    try {
        const genSign = crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(rzp_order_id+'|'+rzp_payment_id)
        .digest("hex")

        if(genSign !== rzp_signature){
            return res.status(400).json({ message: 'Invalid razorpay signature!' })
        }

        const order = await razorpay.orders.fetch(rzp_order_id);
        if (!order || !order.notes.bookingId) {
            return res.status(400).json({ message: "Booking ID not found in Razorpay order!" });
        }

        const bookingId = order.notes.bookingId;
        const booking = await Booking.findById(bookingId);
        if(booking){
            booking.status = "confirmed"
            await booking.save()
        }

        return res.status(200).json({ message: 'Payment successful!', paymentId: rzp_payment_id })
    } catch (error) {
        return res.status(500).json({ message: 'Payment verification failed!' })
    }
}