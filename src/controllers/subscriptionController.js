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

// 🔹 UPDATE / CREATE SUBSCRIPTION
exports.updateSubscription = async (req, res) => {
  try {
    const vendorId = req.user.id || req.user._id;
    const { plan, price, renewalDate } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required"
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔹 CANCEL SUBSCRIPTION
exports.cancelSubscription = async (req, res) => {
  try {
    const vendorId = req.user.id || req.user._id;

    const updated = await Subscription.findOneAndUpdate(
      { vendor: vendorId },
      { status: "cancelled" },
      { new: true }
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
