const express = require("express");
const Carts = require('../models/Carts')
const router = express.Router();

const cartControllers = require("../controllers/cartControllers")
const verifyToken = require('../middleware/verifyToken')


router.get('/',verifyToken, cartControllers.getCartByEmail)
router.post('/', cartControllers.addToCart)
router.delete('/:id', cartControllers.deleteCart)
router.put('/:id', cartControllers.updateCart)
router.get('/:id', cartControllers.getSingleCart)



module.exports = router;