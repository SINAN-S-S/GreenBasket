const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController.js");

const router = express.Router();

// CREATE REAL RAZORPAY ORDER
router.post(
  "/create-order",
  createRazorpayOrder
);

// VERIFY PAYMENT
router.post(
  "/verify-payment",
  verifyPayment
);

module.exports = router;