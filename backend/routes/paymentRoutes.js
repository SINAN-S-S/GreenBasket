const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post(
  "/create-order",
  createRazorpayOrder
);

router.post(
  "/verify-payment",
  verifyPayment
);

module.exports = router;