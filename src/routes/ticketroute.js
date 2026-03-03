const express = require("express");
const router = express.Router();
const ticketTypeCtrl = require("../controllers/ticketController");

router.post("/tickets/create", ticketTypeCtrl.createTicketType);

router.get("/tickets/event/:eventId", ticketTypeCtrl.getEventTicketTypes);

router.put("/tickets/:ticketTypeId", ticketTypeCtrl.updateTicketType);
router.delete("/tickets/:ticketTypeId", ticketTypeCtrl.deleteTicketType);
router.patch(
  "/tickets/:ticketTypeId/status",
  ticketTypeCtrl.updateTicketStatus
);

module.exports = router;
