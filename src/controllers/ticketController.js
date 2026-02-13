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

/**
 * Get all ticket types for a specific event
 * (Ticket Management table)
 */
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
