const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const carRoutes = require("./routes/car");
const authRoutes = require('./routes/auth')
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");
const webhookRoutes = require("./routes/webhook");
require("dotenv").config();
connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/webhook", webhookRoutes);

app.get('/', (req,res) => {
    res.send('Server is Running!')
})

const PORT = process.env.PORT | 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started at Port: ${PORT}`));
