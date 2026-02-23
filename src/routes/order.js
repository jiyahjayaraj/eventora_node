const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {vendorauth} = require("../middleware/auth");

    router.post("/order",vendorauth , orderController.createOrder);
    router.get("/my-orders", vendorauth, orderController.getOrdersByUser);
    router.get("/vendor-orders", vendorauth, orderController.getOrdersByVendor);


module.exports = router;
