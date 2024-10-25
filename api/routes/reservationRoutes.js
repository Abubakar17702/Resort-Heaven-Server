// routes/reservationRoutes.js
const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation"); // Ensure correct path

// POST endpoint to handle reservation submission
router.post("/", async (req, res) => {
  console.log(req.body); // Log incoming request data
  const { name, email, phone, date, time, guests, specialRequests } = req.body;

  try {
    const newReservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
    });
    await newReservation.save();
    res.status(201).json({ message: "Reservation made successfully!" });
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({ message: error.message });
  }
});

// PATCH endpoint to update reservation status
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint to fetch all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE endpoint to handle reservation deletion
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
