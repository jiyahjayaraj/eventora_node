  /* ======================
    create EVENT
  ====================== */

  const Event = require("../models/eventModel");
  exports.addEvent = async (req, res) => {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    try {

      // If image uploaded
      const photo = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const event = await Event.create({
        ...req.body,
        bannerImage  : photo// 👈 save photo path in DB
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

  console.log("UPDATE HIT");   // 👈 ADD THIS
  console.log(req.body);       // 👈 ADD THIS
  console.log(req.file);   
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.vendorId.toString() !== req.user)
      return res.status(403).json({ message: "Unauthorized access" });

    // Update text fields
    Object.assign(event, req.body);

    // Update image if uploaded
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
      const { id } = req.params; // or req.user.id

      if (!id) {
        return res.status(400).json({ message: "Vendor ID missing" });
      }


      const events = await Event.find({
        vendorId: id
      })
  console.log(events,id);

      return res.status(200).json({
        message: "Events fetched",
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

  exports.getAllEvents = async (req, res) => {
    console.log("aa");
    
  try {
    const events = await Event.find();
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