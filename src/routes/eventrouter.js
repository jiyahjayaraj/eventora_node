const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventcontroller");
const { vendorauth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/events",eventController.getAllEvents);
router.get("/events/vendor/:id", eventController.getEvents);
router.get("/events/:id",eventController.getEventById)
router.post(
  "/events",
  vendorauth,
  upload.single("bannerImage"),
  eventController.addEvent
);

router.put(
  "/events/:id",
  vendorauth,
  upload.single("photo"),
  eventController.updateEvent
);

router.delete(
  "/events/:id",
  vendorauth,
  eventController.deleteEvent
);

module.exports = router;
