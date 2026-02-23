const express = require('express');
const router = express.Router();

const { vendorauth } = require('../middleware/auth');
const { getRevenueReport } = require('../controllers/revenueController');

router.get(
  '/organizer/revenue',
  vendorauth,          // ✅ use the actual function
  getRevenueReport
);

module.exports = router;
