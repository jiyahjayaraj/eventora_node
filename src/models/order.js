    const mongoose=require("mongoose")
    const orderSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        // required: true
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      totalAmount: {
        type: Number,
        required: true
      },
     paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending"
},
      orderStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
      }
    },
    { timestamps: true }
  );  
  module.exports = mongoose.model("Order", orderSchema);