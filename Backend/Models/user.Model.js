const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  verified: { type: Boolean, default: false },
  dateBirth: { type: Date, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "/uploads/avatarpfp.jpg" },
  bookings: [
    {
      tour: { type: mongoose.Types.ObjectId, ref: "Tour" },
      bookingDate: { type: Date, default: Date.now },
    },
  ],
},
{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
