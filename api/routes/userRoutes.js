const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require('../middleware/verifyAdmin')


router.get("/",verifyToken, verifyAdmin, userControllers.getAllUsers);
router.post("/", userControllers.createUser);
router.delete("/:id",verifyToken, verifyAdmin, userControllers.deleteUser);
router.delete("/:id", userControllers.deleteUser);
router.get("/admin/:email",verifyToken, userControllers.getAdmin);
router.patch("/admin/:id",verifyToken, verifyAdmin, userControllers.makeAdmin);

module.exports = router;
