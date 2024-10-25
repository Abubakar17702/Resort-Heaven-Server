const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Scehma Object For Menu Items
const menuSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  recipe: String,
  image: String,
  category: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Model
const Menu = mongoose.mongoose.model("Menu", menuSchema);
module.exports = Menu;
