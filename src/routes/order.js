const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/order", orderController.createOrder);
router.get("/my-orders",orderController.getUserOrders);
router.get("/vendor-orders", orderController.getVendorOrders);

module.exports = router;
