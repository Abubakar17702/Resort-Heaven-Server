const express = require("express");
const mongoose = require("mongoose");
const Payment = require("../models/Payments");
const Cart = require("../models/Carts");
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

// Middleware
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Post Payment Info to DB
router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;
  try {
    const paymentRequest = await Payment.create(payment);

    // Delete Cart After Payment
    const cartIds = payment.cartItems.map((id) => new ObjectId(id));
    await Cart.deleteMany({ _id: { $in: cartIds } });

    res.status(200).json(paymentRequest);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get Payments by User Email
router.get("/", verifyToken, async (req, res) => {
  const email = req.query.email;
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      return res.status(403).json({ message: "Forbidden Access" });
    }
    const payments = await Payment.find({ email })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(payments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get All Payments (Admin Access)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(payments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Confirm Payment Status
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const payId = req.params.id;
  try {
    const updatedStatus = await Payment.findByIdAndUpdate(
      payId,
      { status: "confirmed" },
      { new: true, runValidators: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ message: "Payment Not Found" });
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete Payment (Admin Access)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const paymentId = req.params.id;
  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }
    res
      .status(200)
      .json({ message: "Payment deleted successfully", deletedPayment });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
