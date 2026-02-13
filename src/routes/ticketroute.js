const express = require("express");
const router = express.Router();
const ticketTypeCtrl = require("../controllers/ticketController");

router.post("/create", ticketTypeCtrl.createTicketType);

router.get("/event/:eventId", ticketTypeCtrl.getEventTicketTypes);

router.put("/:ticketTypeId", ticketTypeCtrl.updateTicketType);

router.patch(
  "/:ticketTypeId/status",
  ticketTypeCtrl.updateTicketStatus
);

module.exports = router;
