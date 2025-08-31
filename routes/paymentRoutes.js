const express = require('express');
const router = express.Router();
const { createStripeSession } = require('../controllers/paymentController');

router.post('/create-checkout-session', createStripeSession);

module.exports = router;
