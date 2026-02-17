const Order = require("../models/order");
const Event = require("../models/eventModel");

/* CREATE ORDER */
exports.createOrder = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User not identified" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const totalAmount = event.price * quantity;

    const order = await Order.create({
      userId,
      vendorId: event.vendorId,
      eventId,
      quantity,
      totalAmount
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* USER ORDERS */
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

/* VENDOR ORDERS */
exports.getVendorOrders = async (req, res) => {
  const orders = await Order.find({ vendorId: req.user.id });
  res.json(orders);
};
