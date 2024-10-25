const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer"); // Ensure correct path

// POST endpoint to handle offer submission
router.post("/", async (req, res) => {
  const {
    title,
    description,
    discount,
    originalPrice,
    discountedPrice,
    image,
    startDate,
    expiryDate,
  } = req.body;

  try {
    const newOffer = new Offer({
      title,
      description,
      discount,
      originalPrice, // Add original price
      discountedPrice, // Add discounted price
      image,
      startDate,
      expiryDate,
    });
    await newOffer.save();
    res.status(201).json({ message: "Offer added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint to fetch only active offers
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({ expiryDate: { $gt: now } }); // Fetch only active offers
    console.log("Fetched Offers:", offers);
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE endpoint to remove an offer (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer)
      return res.status(404).json({ message: "Offer not found." });
    res.status(200).json({ message: "Offer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
