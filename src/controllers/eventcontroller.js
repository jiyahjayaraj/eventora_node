
const Event = require("../models/eventModel");
const Subscription = require("../models/subscriptionModel");
const PLANS = require("../config/subscriptionPlans");

exports.addEvent = async (req, res) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    const vendorId = req.user;

    let subscription = await Subscription.findOne({
      vendor: vendorId,
      status: "active"
    });

    // If no subscription → treat as BASIC
    if (!subscription) {
      subscription = { plan: "basic" };
    }

    const planConfig = PLANS[subscription.plan];

    if (!planConfig) {
      return res.status(400).json({
        message: "Invalid subscription plan"
      });
    }

    const maxEvents = planConfig.maxEvents;

    const eventCount = await Event.countDocuments({
      vendorId
    });

    // -1 = unlimited
    if (maxEvents !== -1 && eventCount >= maxEvents) {
      return res.status(403).json({
        message: `Event limit reached for ${subscription.plan} plan`
      });
    }
    // =========================================


    const photo = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const event = await Event.create({
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      description: req.body.description,
      city: req.body.city,
      eventLocation: req.body.eventLocation,
      eventDate: req.body.eventDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      price: Number(req.body.price) || 0,
      totalTickets: Number(req.body.totalTickets) || 0,
      earlyPrice: Number(req.body.earlyPrice) || 0,
      earlyDeadline: req.body.earlyDeadline || null,
      vendorId,
      bannerImage: photo
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({
      message: "Event creation failed",
      error: error.message
    });
  }
};

/* ======================
  UPDATE EVENT
====================== */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.vendorId.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    event.eventName = req.body.eventName;
    event.eventType = req.body.eventType;
    event.description = req.body.description;
    event.city = req.body.city;
    event.eventLocation = req.body.eventLocation;
    event.eventDate = req.body.eventDate;
    event.startTime = req.body.startTime;
    event.endTime = req.body.endTime;
    event.price = Number(req.body.price) || 0;
    event.totalTickets = Number(req.body.totalTickets) || 0;
    event.earlyPrice = Number(req.body.earlyPrice) || 0;
    event.earlyDeadline = req.body.earlyDeadline || null;

    if (req.file) {
      event.bannerImage = `/uploads/${req.file.filename}`;
    }

    await event.save();

    res.json({
      message: "Event updated successfully",
      event
    });

  } catch (error) {
    res.status(500).json({
      message: "Event update failed",
      error: error.message
    });
  }
};
/* ======================
  DELETE EVENT
====================== */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.vendorId.toString() !== req.user)
      return res.status(403).json({ message: "Unauthorized access" });

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Event deletion failed",
      error: error.message
    });
  }
};

/* ======================
  GET ALL EVENTS (PUBLIC)
====================== */


exports.getEvents = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Vendor ID missing" });
    }

    const events = await Event.find({ vendorId: id });

    const formattedEvents = events.map(event => ({
      ...event._doc,
      eventDate: new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    }));

    return res.status(200).json({
      message: "Events fetched",
      events: formattedEvents
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllEvents = async (req, res) => {
  console.log("aa");

  try {
    const events = await Event.find().populate("eventType", "name");
    console.log(events);

    return res.status(200).json({
      message: "All events fetched",
      events
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    return res.status(200).json(event); // 👈 RETURN EVENT DIRECTLY
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.addfeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    // rating is required
    if (rating === undefined) {
      return res.status(400).json({ message: "Rating is required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.feedbacks.push({
      userId: req.user,   // from userAuth middleware
      comment,            // optional
      rating
    });

    await event.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      event
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit feedback",
      error: error.message
    });
  }
};

exports.getVendorFeedbacks = async (req, res) => {
  try {
    const vendorId = req.user; // from vendorauth middleware

    // Get vendor events with feedback
    const events = await Event.find({ vendorId })
      .select("title feedbacks bannerImage")
      .populate("feedbacks.userId", "name email");

    // Flatten feedbacks
    const feedbacks = events.flatMap(event =>
      event.feedbacks.map(fb => ({
        _id: fb._id,
        eventId: event._id,
        eventTitle: event.title,
        bannerImage: event.bannerImage,
        user: fb.userId,
        rating: fb.rating,
        comment: fb.comment,
        createdAt: fb.createdAt
      }))
    );

    // Dashboard stats
    const totalFeedback = feedbacks.length;
    const averageRating =
      totalFeedback > 0
        ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        ).toFixed(1)
        : 0;

    res.status(200).json({
      message: "Vendor feedback fetched",
      totalFeedback,
      averageRating,
      feedbacks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch feedback",
      error: error.message
    });
  }
};
/* ======================
   DELETE FEEDBACK
====================== */
exports.deleteVendorFeedback = async (req, res) => {
  try {
    const vendorId = req.user;
    const { feedbackId } = req.params;

    // Find event that contains this feedback
    const event = await Event.findOneAndUpdate(
      { vendorId, "feedbacks._id": feedbackId },
      { $pull: { feedbacks: { _id: feedbackId } } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        message: "Feedback not found or unauthorized"
      });
    }

    res.status(200).json({
      message: "Feedback deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};