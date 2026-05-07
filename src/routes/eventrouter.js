const express = require("express");
const router = express.Router();
const {addfeedback} = require("../controllers/eventcontroller")
const {getVendorFeedbacks} = require("../controllers/eventcontroller")
const eventController = require("../controllers/eventcontroller");
const {userAuth,vendorAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/events",eventController.getAllEvents);
router.get("/events/vendor/:id", eventController.getEvents);
router.get("/events/:id",eventController.getEventById)
router.post("/events/vendor",vendorAuth,upload.single("bannerImage"),eventController.addEvent);
router.put("/events/:id",vendorAuth,upload.single("bannerImage"),eventController.updateEvent);
router.delete("/events/:id",vendorAuth,eventController.deleteEvent);
router.post("/events/:id/feedback",userAuth,addfeedback);
router.get("/vendor/feedbacks",vendorAuth,getVendorFeedbacks);
router.delete("/vendor/feedback/:feedbackId",vendorAuth,eventController.deleteVendorFeedback);

module.exports = router;
