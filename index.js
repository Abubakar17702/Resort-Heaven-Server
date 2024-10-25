require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration Using Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@resortheavenproject.wr7fo.mongodb.net/ResortHeavenProject?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Mongodb Connected Successfully!");
  })
  .catch((error) => {
    console.log("Error Connecting To Mongodb", error);
  });

// Jwt Token Authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

// Import Routes Here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const verifyToken = require("./api/middleware/verifyToken");
const adminStats = require("./api/routes/adminStats");
const orderStats = require("./api/routes/orderStats");
const contactRoutes = require("./api/routes/contactRoutes");
const reservationRoutes = require("./api/routes/reservationRoutes");
const eventRoutes = require("./api/routes/eventRoutes");
const offerRoutes = require("./api/routes/offerRoutes");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);
app.use("/adminStats", adminStats);
app.use("/orderStats", orderStats);
app.use("/contacts", contactRoutes);
app.use("/reservation", reservationRoutes);
app.use("/api", eventRoutes);
app.use("/api/offers", offerRoutes);

// Stripe Payment Routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
});

let userProfile = {
  name: "",
  photoURL: "",
};

//  Update profile endpoint
app.put("/api/update-profile", (req, res) => {
  const { name, photoURL } = req.body;

  // Logic to update the user profile
  if (name) userProfile.name = name;
  if (photoURL) userProfile.photoURL = photoURL;

  // Respond with the updated profile
  res.json({ message: "Profile updated successfully", profile: userProfile });
});

// Route for Home
app.get("/", (req, res) => {
  res.send("Welcome To Resort Heaven!");
});

// Starting the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
