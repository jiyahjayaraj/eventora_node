// controllers/revenueController.js

const Order = require('../models/order');
const mongoose = require('mongoose');

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const organizerId = req.user.id; // from auth middleware

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and End date are required"
      });
    }

    const matchStage = {
      paymentStatus: "SUCCESS",
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    // =========================
    // 1️⃣ TOTAL SUMMARY
    // =========================

    const summaryResult = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          ticketsSold: { $sum: "$ticketQuantity" },
          processingFees: { $sum: "$processingFee" }
        }
      }
    ]);

    const summary = summaryResult[0] || {
      totalRevenue: 0,
      ticketsSold: 0,
      processingFees: 0
    };

    // =========================
    // 2️⃣ DAILY OVERVIEW (Chart)
    // =========================

    const overview = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          tickets: { $sum: "$ticketQuantity" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    const formattedOverview = overview.map(item => ({
      date: `${item._id.day}-${item._id.month}`,
      revenue: item.revenue,
      tickets: item.tickets
    }));

    // =========================
    // 3️⃣ EARNINGS BY EVENT (Table)
    // =========================

    const earnings = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$eventId",
          ticketsSold: { $sum: "$ticketQuantity" },
          totalRevenue: { $sum: "$totalAmount" },
          processingFees: { $sum: "$processingFee" }
        }
      },
      {
        $lookup: {
          from: "events", // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $project: {
          eventName: "$event.title",
          ticketsSold: 1,
          totalRevenue: 1,
          processingFees: 1
        }
      }
    ]);

    // =========================
    // FINAL RESPONSE
    // =========================

    res.status(200).json({
      summary,
      overview: formattedOverview,
      earnings
    });

  } catch (error) {
    console.error("Revenue Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
