const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },


    planName: {
      type: String,
      required: true,
      trim: true,
    },


    /*
    =========================
    PAYMENT METHOD
    =========================
    */

    paymentMethod: {
      type: String,

      enum: [
        "card",
        "upi",
        "razorpay",
      ],

      required: true,
    },


    /*
    =========================
    OLD CARD FIELDS

    Keep them for your old
    payment records.
    =========================
    */

    cardholderName: {
      type: String,
      default: "",
      trim: true,
    },


    cardLast4: {
      type: String,
      default: "",
    },


    expiryMonth: {
      type: String,
      default: "",
    },


    expiryYear: {
      type: String,
      default: "",
    },


    /*
    =========================
    RAZORPAY
    =========================
    */

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },


    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
    },


    razorpaySignature: {
      type: String,
      default: "",
    },


    /*
    =========================
    AMOUNT
    Store in paise.

    ₹149 = 14900
    =========================
    */

    amount: {
      type: Number,
      default: 0,
    },


    currency: {
      type: String,
      default: "INR",
    },


    /*
    =========================
    STATUS
    =========================
    */

    paymentStatus: {
      type: Boolean,
      default: false,
    },


    status: {
      type: String,

      enum: [
        "created",
        "paid",
        "failed",
      ],

      default: "created",
    },
  },
  {
    timestamps: true,
  }
);


/*
=========================
PREVENT DUPLICATE PAYMENT ID
=========================
*/

paymentSchema.index(
  {
    razorpayPaymentId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);


module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );