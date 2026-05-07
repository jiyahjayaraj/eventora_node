const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {userAuth,vendorAuth} = require("../middleware/auth");


    router.post("/order",userAuth , orderController.createOrder);
    router.get("/my-orders", userAuth, orderController.getOrdersByUser);
    router.get("/vendor-orders", vendorAuth, orderController.getOrdersByVendor);
    router.get("/all-orders", vendorAuth, orderController.getAllOrders);


module.exports = router;
