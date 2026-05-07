const express = require('express');
const router = express.Router();

const { vendorAuth } = require('../middleware/auth');
const { getRevenueReport } = require('../controllers/revenueController');

router.get(
  '/organizer/revenue',
  vendorAuth,          // ✅ use the actual function
  getRevenueReport
);

module.exports = router;
