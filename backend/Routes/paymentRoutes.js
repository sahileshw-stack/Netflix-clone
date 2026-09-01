const express = require("express");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
} = require(
  "../Controllers/paymentController"
);

const router = express.Router();


/*
=========================
RAZORPAY WEBHOOK
=========================
*/

router.post(
  "/razorpay/webhook",

  express.raw({
    type: "application/json",
  }),

  razorpayWebhook
);


/*
=========================
CREATE RAZORPAY ORDER
=========================
*/

router.post(
  "/razorpay/create-order",
  createRazorpayOrder
);


/*
=========================
VERIFY RAZORPAY PAYMENT
=========================
*/

router.post(
  "/razorpay/verify",
  verifyRazorpayPayment
);


module.exports = router;