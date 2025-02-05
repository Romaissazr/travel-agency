const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/payment.controller");

// Create a payment
router.post("/", paymentController.createPayment);

// Get payment status by ID
router.get("/:id", paymentController.getPaymentStatus);

// Update payment status

module.exports = router;
