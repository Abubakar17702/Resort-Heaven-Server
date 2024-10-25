// models/reservation.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequests: { type: String, default: "" },
    status: { type: String, default: "pending" }, // Add status field with a default value
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
