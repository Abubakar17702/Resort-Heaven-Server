const express = require("express");
const router = express.Router();

// Import Models
const User = require("../models/User");
const Menu = require("../models/Menu");
const Payment = require("../models/Payments");

// Middleware
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Get All Order Stats
router.get("/", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: "$menuItems",
      },
      {
        $lookup: {
          from: "menus",
          localField: "menuItems",
          foreignField: "_id",
          as: "menuItemsDetails",
        },
      },
      {
        $unwind: "$menuItemsDetails",
      },
      {
        $group: {
          _id: "$menuItemsDetails.category",
          quantity: { $sum: "$quantity" },
          revenue: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          quantity: "$quantity",
          revenue: "$revenue",
        },
      },
    ]);
    res.json(result);
    // res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error" + error.message);
  }
});



module.exports = router;
