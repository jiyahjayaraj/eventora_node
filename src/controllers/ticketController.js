const TicketType = require("../models/ticketModel");

/**
 * Create a new ticket type for an event
 * (Create New Ticket Type button)
 */
exports.createTicketType = async (req, res) => {
  try {
    const ticketType = await TicketType.create(req.body);
    res.status(201).json(ticketType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventTicketTypes = async (req, res) => {
  try {
    const tickets = await TicketType.find({
      eventId: req.params.eventId
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update ticket type (Edit button)
 */
exports.updateTicketType = async (req, res) => {
  try {
    const updatedTicket = await TicketType.findByIdAndUpdate(
      req.params.ticketTypeId,
      req.body,
      { new: true }
    );

    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Activate / Deactivate ticket
 */
exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await TicketType.findByIdAndUpdate(
      req.params.ticketTypeId,
      { status: req.body.status },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete ticket type
 * (Delete button)
 */
exports.deleteTicketType = async (req, res) => {
  try {
    const ticket = await TicketType.findById(req.params.ticketTypeId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    // 🔒 Optional safety: prevent delete if tickets sold
    if (ticket.ticketsSold > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete ticket type with sold tickets" });
    }

    await TicketType.findByIdAndDelete(req.params.ticketTypeId);

    res.json({ message: "Ticket type deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
