const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    city: { type: mongoose.Types.ObjectId, ref: "City", required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    status: { type: String, enum: ["active", "fully booked"], default: "active" },
    availableDates: [
      {
        date: { type: Date, required: true },
        availableSlots: { type: Number, required: true },
      },
    ],
    time: { type: String, required: true },
    activity: { type: [String], required: true },
    included: { type: [String], default: [] },
    notIncluded: { type: [String], default: [] },
    safety: { type: String, default: "" },
    language: { type: [String], default: ["English"] },
    meetingPoint: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    reviews: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
        comment: { type: String, default: "" },
      },
    ],
    featured: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);

module.exports = Tour;
