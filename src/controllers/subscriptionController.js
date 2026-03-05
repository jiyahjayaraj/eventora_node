const Subscription = require("../models/subscriptionModel");
const PLANS = require("../config/subscriptionPlans");
/*
================================================
GET MY SUBSCRIPTION
Vendor only
================================================
*/
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      vendor: req.user
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


/*
================================================
UPGRADE / CHANGE PLAN (ChatGPT-style)
Creates if not exists
================================================
*/
exports.upgradeSubscription = async (req, res) => {
  try {
    const vendorId = req.user;
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required"
      });
    }

    const planConfig = PLANS[plan];

    if (!planConfig) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan"
      });
    }

    const { price, days } = planConfig;

    const renewalDate = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    );

    const subscription = await Subscription.findOneAndUpdate(
      { vendor: vendorId },
      {
        vendor: vendorId,
        plan,
        price,
        renewalDate,
        status: "active"
      },
      {
        new: true,
        upsert: true
      }
    );

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


/*
================================================
CANCEL SUBSCRIPTION
================================================
*/
exports.cancelSubscription = async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      {
        vendor: req.user,
        status: "active"
      },
      {
        status: "cancelled"
      },
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