const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST endpoint to handle form submission
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact information saved successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// In your contact routes file (e.g., routes/contact.js)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contact messages
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
