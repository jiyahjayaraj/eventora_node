const router = require("express").Router();

const {
  getSubscription,
  upgradeSubscription,
  cancelSubscription,getAllSubscriptions
} = require("../controllers/subscriptionController");


const { vendorAuth,adminAuth } = require("../middleware/auth");


router.get("/subscription", vendorAuth, getSubscription);

router.get("/admin/subscription", adminAuth, getAllSubscriptions);

router.put("/subscription/upgrade", vendorAuth, upgradeSubscription);

router.put("/subscription/cancel", vendorAuth, cancelSubscription);

module.exports = router;