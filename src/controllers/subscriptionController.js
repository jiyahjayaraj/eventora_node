const Subscription = require("../models/subscriptionModel");

// 🔹 GET SUBSCRIPTION
exports.getSubscription = async (req, res) => {
  try {
    const vendorId = req.user.id || req.user._id;

    const subscription = await Subscription.findOne({
      vendor: vendorId
    });

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateSubscription = async (req, res) => {
  try {
    const vendorId = req.user.id || req.user._id;
    const { plan, renewalDate } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required"
      });
    }

    // ✅ Backend price source of truth
    const PLAN_PRICES = {
      basic: 0,
      professional: 2999,
      enterprise: 7999
    };

    const price = PLAN_PRICES[plan];

    if (price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan"
      });
    }

    const finalRenewalDate = renewalDate
      ? new Date(renewalDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const updated = await Subscription.findOneAndUpdate(
      { vendor: vendorId },
      {
        vendor: vendorId,
        plan,
        price,
        renewalDate: finalRenewalDate,
        status: "active"
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const updated = await Subscription.findOneAndUpdate(
      { vendor: vendorId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found"
      });
    }

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};