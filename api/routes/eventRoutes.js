// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event"); // Ensure correct path

// POST endpoint to handle event booking submission
router.post("/event-booking", async (req, res) => {
  const {
    name,
    email,
    phone,
    date,
    time,
    guests,
    eventDescription,
    specialRequests,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !phone ||
    !date ||
    !time ||
    !guests ||
    !eventDescription
  ) {
    return res
      .status(400)
      .json({ message: "All fields except special requests are required." });
  }

  try {
    // Create a new Event booking
    const newEvent = new Event({
      name,
      email,
      phone,
      date,
      time,
      guests,
      eventDescription,
      specialRequests,
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({ message: "Event booking successful!" });
  } catch (error) {
    console.error("Event booking error:", error);
    res
      .status(500)
      .json({ message: "Event booking failed. Please try again later." });
  }
});

// Other potential endpoints (GET, DELETE, etc.) can be added as needed

module.exports = router;
