const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/paymentController");

router.post("/create", paymentCtrl.createPayment);

module.exports = router;
