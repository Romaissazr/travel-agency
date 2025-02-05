const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  images: { type: [String], required: true },
  description: { type: String, required: true },
});

const City = mongoose.models.City || mongoose.model("City", citySchema);

module.exports = City;
