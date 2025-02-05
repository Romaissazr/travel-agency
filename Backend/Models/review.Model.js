const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Types.ObjectId, ref: "Tour", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
