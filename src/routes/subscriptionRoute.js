const router = require("express").Router();

const {
  getSubscription,
  upgradeSubscription,
  cancelSubscription,getAllSubscriptions
} = require("../controllers/subscriptionController");

const { vendorauth } = require("../middleware/auth");

router.get("/subscription", vendorauth, getSubscription);

router.get("/admin/subscription", vendorauth, getAllSubscriptions);

router.put("/subscription/upgrade", vendorauth, upgradeSubscription);

router.put("/subscription/cancel", vendorauth, cancelSubscription);

module.exports = router;