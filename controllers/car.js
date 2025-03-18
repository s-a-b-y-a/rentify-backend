const Car = require("../models//car");
const Booking = require("../models/booking");

exports.getCars = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find expired bookings and mark them as completed
    const expiredBookings = await Booking.find({
      endDate: { $lt: currentDate },
      status: "confirmed",
    });

    if (expiredBookings.length > 0) {
      // Get car IDs from expired bookings
      const carIds = expiredBookings.map((booking) => booking.car);

      // Mark expired bookings as "completed"
      await Booking.updateMany(
        { _id: { $in: expiredBookings.map((b) => b._id) } },
        { status: "completed" }
      );

      // Update car availability to true for those cars
      await Car.updateMany(
        { _id: { $in: carIds } },
        { availability: true }
      );
    }

    // Fetch all cars
    const cars = await Car.find({ availability: true });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching cars!", error });
  }
};


exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found!" });

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching car!", error });
  }
};

// Admin only
exports.addCar = async (req, res) => {
  const { name, brand, rentPerDay, location, image } = req.body;
  const parsedLocation = JSON.parse(location)

  try {
    const newCar = new Car({ name, brand, rentPerDay, location: parsedLocation, image });
    await newCar.save();
    return res.status(201).json({ message: "Car added successfully!", newCar });
  } catch (error) {
    return res.status(500).json({ message: "Error adding car", error });
  }
};

// Admin only
exports.updateCar = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Ensure location is parsed if it's a string
    if (typeof req.body.location === "string") {
      try {
        updateData.location = JSON.parse(req.body.location);
      } catch (error) {
        return res.status(400).json({ message: "Invalid location format" });
      }
    }

    await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      upsert: true,
    });

    return res.status(200).json({ message: "Car updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating car", error });
  }
};

// Admin only
exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: "Car not found!" });

    return res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting car", error });
  }
};
