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
    res.status(500).json({ message: error.message });
  }
};
exports.updateSubscription = async (req, res) => {
  try {
    const { plan, price } = req.body;

    const updated = await Subscription.findOneAndUpdate(
      { vendor: req.user },
      {
        plan,
        price,
        renewalDate: new Date(Date.now() + 30*24*60*60*1000),
        status: "active"
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.cancelSubscription = async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { vendor: req.user },
      { status: "cancelled" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
