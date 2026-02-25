const Order = require("../models/order");
const Event = require("../models/eventModel");
const User = require("../models/userModel")

/* ===========================
   CREATE ORDER (User Only)
=========================== */
exports.createOrder = async (req, res) => {
  const userId = req.user;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { eventId, quantity, totalAmount } = req.body;

    if (!eventId || !quantity || !totalAmount) {
      return res.status(400).json({
        message: "Event ID, quantity and total amount required"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableTickets < quantity) {
      return res.status(400).json({
        message: "Not enough tickets available"
      });
    }

    const order = new Order({
      userId,
      eventId: event._id,
      vendorId: event.vendorId,
      quantity,
      totalAmount,
      paymentStatus: "pending"
    });

    await order.save();

    event.availableTickets -= quantity;
    await event.save();

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};    
/* ===========================
   GET ORDERS BY USER
=========================== */
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const orders = await Order.find({ userId })
      .populate("eventId")
      .populate("vendorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders fetched successfully",
      orders
    });

  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ===========================
   GET ORDERS BY VENDOR
=========================== */
/* ===========================
   GET ORDERS BY VENDOR
=========================== */
exports.getOrdersByVendor = async (req, res) => {
  try {
    const vendorId = req.user;

    if (!vendorId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log(vendorId);

    let orders = await Order.find({ vendorId: vendorId })
      .populate("userId", "name")      // ✅ show customer name
      .populate("eventId", "title")    // ✅ show event title
      .sort({ createdAt: -1 });        // optional but good

    res.status(200).json(orders);

  } catch (error) {
    console.error("GET VENDOR ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};