const Car = require("../models/car");
const Booking = require("../models/booking");

// Renting a Car
exports.bookCar = async (req, res) => {
  const { carID, startDate, endDate } = req.body;

  try {
    const car = await Car.findById(carID);
    if (!car) return res.status(404).json({ message: "Car not found!" });

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format!" });
    }

    const timeDifference = end.getTime() - start.getTime();
    const totalHours = timeDifference / (1000 * 60 * 60);
    const fullDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24; // remaining hours

    let totalPrice;

    if (remainingHours < 6) {
      totalPrice =
        fullDays * car.rentPerDay + remainingHours * (car.rentPerDay / 24);
    } else {
      totalPrice = (fullDays + 1) * car.rentPerDay;
    }

    totalPrice = Math.ceil(totalPrice);

    car.availability = false;

    const booking = new Booking({
      user: req.user._id,
      car: carID,
      startDate: start,
      endDate: end,
      totalPrice,
    });

    await booking.save();
    await car.save();

    return res.status(200).json({
      message: "Car booked successfully!",
      bookingId: booking._id,
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error booking car!", error });
  }
};

// Get all bookings of a logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: { $in: ["confirmed", "completed"] },
    }).populate({
      path: "car",
      select: "name brand image location",
    });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings!", error });
  }
};

// cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "not authorized to cancel this booking!" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled!" });
    }

    const car = await Car.findById(booking.car);
    car.availability = true;
    booking.status = "cancelled";
    await booking.save();
    await car.save();

    return res.status(200).json({ message: "Booking cancelled successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error cancelling booking!", error });
  }
};
