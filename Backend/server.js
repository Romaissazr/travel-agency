const express = require("express");
require('events').EventEmitter.defaultMaxListeners = 15;

const bodyParser = require("body-parser");
const cors = require("cors");
const DBConnection = require("./Config/DBConnection");
const tourRoutes = require("./Routes/tour.Routes");
const cityRoutes = require("./Routes/cities.Routes");
const userRoutes = require("./Routes/user.Routes");
const otpRoutes = require("./Routes/opt.Routes");
const bookingRoutes = require("./Routes/booking.Routes");
const reviewRoutes = require("./Routes/review.Routes");
const paymentRoutes = require("./Routes/payment.Routes");
const galleryRoutes = require("./Routes/gallery.Routes");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/otp", otpRoutes);
app.use("/city", cityRoutes);
app.use("/tours", tourRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes); 
app.use("/reviews", reviewRoutes); 
app.use("/payments", paymentRoutes);
app.use("/gallery", galleryRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

const ip = '0.0.0.0'; 
app.listen(PORT, ip, () => {
  console.log(`Server is running on port ${PORT}`);
  DBConnection();
});

module.exports = app;