const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: Number, required: true },
  originalPrice: { type: Number, required: true }, // Add this field
  discountedPrice: { type: Number, required: true }, // Add this field
  image: { type: String, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model("Offer", OfferSchema);
