const router = require("express").Router();

const {
  getSubscription,
  upgradeSubscription,
  cancelSubscription
} = require("../controllers/subscriptionController");

const { vendorauth } = require("../middleware/auth");

router.get("/subscription", vendorauth, getSubscription);

router.put("/subscription/upgrade", vendorauth, upgradeSubscription);

router.put("/subscription/cancel", vendorauth, cancelSubscription);

module.exports = router;