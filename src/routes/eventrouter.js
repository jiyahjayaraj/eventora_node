const express = require("express");
const router = express.Router();
const {addfeedback} = require("../controllers/eventcontroller")
const {getVendorFeedbacks} = require("../controllers/eventcontroller")
const eventController = require("../controllers/eventcontroller");
const { vendorauth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/events",eventController.getAllEvents);
router.get("/events/vendor/:id", eventController.getEvents);
router.get("/events/:id",eventController.getEventById)
router.post(
  "/events/vendor",
  vendorauth,
  upload.single("bannerImage"),
  eventController.addEvent
);

router.put(
  "/events/:id",
  vendorauth,
  upload.single("bannerImage"),
  eventController.updateEvent
);

router.delete(
  "/events/:id",
  vendorauth,
  eventController.deleteEvent
);
router.post("/events/:id/feedback", addfeedback);
router.get(
  "/vendor/feedbacks",
  vendorauth,
  getVendorFeedbacks
);
module.exports = router;
