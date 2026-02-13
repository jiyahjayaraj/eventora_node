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
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.vendorId.toString() !== req.user)
      return res.status(403).json({ message: "Unauthorized access" });

    Object.assign(event, req.body);

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

