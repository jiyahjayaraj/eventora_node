const Order = require("../models/order");
const Event = require("../models/eventModel");

/* ===========================
   CREATE ORDER (User Only)
=========================== */
exports.createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user; // ✅ correct for your middleware

    let { eventId, quantity, totalAmount } = req.body;

    quantity = Number(quantity);
    totalAmount = Number(totalAmount);

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
      paymentStatus: "pending",
      orderStatus: "Pending"
    });

    await order.save();

   await Event.findByIdAndUpdate(
  eventId,
  { $inc: { availableTickets: -quantity } }
);

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  }catch (error) {
  console.error("FULL ERROR:", error);
  return res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: "Server error while fetching user orders" });
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

    console.log("------ VENDOR ORDER DEBUG ------");

    console.log("req.user:", req.user);

    const vendorId = req.user?.id || req.user;

    console.log("Vendor ID used for query:", vendorId);

    const orders = await Order.find({ vendorId })
      .populate("userId", "name email")
      .populate("eventId", "eventName eventDate")
      .sort({ createdAt: -1 });

    console.log("Orders found:", orders);
    console.log("Orders count:", orders.length);

    console.log("------ END DEBUG ------");

    res.status(200).json({
      orders
    });

  } catch (error) {

    console.error("GET VENDOR ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch vendor orders"
    });

  }
};
/* ===========================
   GET ALL ORDERS (ADMIN)
=========================== */
exports.getAllOrders = async (req, res) => {
  try {

const orders = await Order.find()
  .populate({
    path: "userId",
    select: "name email"
  })
  .populate({
    path: "vendorId",
    select: "vendorName email"
  })
  .populate({
    path: "eventId",
    select: "eventName eventDate"
  })
  .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      orders
    });

  } catch (error) {

    console.error("GET ALL ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch all orders"
    });

  }
};