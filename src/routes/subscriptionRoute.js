const router = require("express").Router();
const { 
  getSubscription, 
  updateSubscription, 
  cancelSubscription 
} = require("../controllers/subscriptionController");

const { vendorauth } = require("../middleware/auth");

router.get("/subscription", vendorauth, getSubscription);
router.put("/subscription/update", vendorauth, updateSubscription);
router.put("/subscription/cancel", vendorauth, cancelSubscription);

module.exports = router;
