const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Payment = require("../Models/Payment");
const User = require("../Models/User");
const Plan = require("../Models/Plan");

console.log(
  "Razorpay Key ID loaded:",
  Boolean(process.env.RAZORPAY_KEY_ID)
);

console.log(
  "Razorpay Secret loaded:",
  Boolean(process.env.RAZORPAY_KEY_SECRET)
);

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});


/*
=========================
CREATE RAZORPAY ORDER
=========================
*/

const createRazorpayOrder =
  async (req, res) => {

    try {

      const {
        token,
        planId,
      } = req.body || {};


      if (!token) {

        return res.status(400).json({
          success: false,
          message:
            "Signup token is required",
        });

      }


      if (!planId) {

        return res.status(400).json({
          success: false,
          message:
            "Plan ID is required",
        });

      }


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      const user =
        await User.findById(
          decoded.userId
        );


      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });

      }


      const plan =
        await Plan.findById(
          planId
        );


      if (!plan) {

        return res.status(404).json({
          success: false,
          message:
            "Plan not found",
        });

      }


      /*
      =========================
      AMOUNT IN PAISE
      ₹149 = 14900
      =========================
      */

      const amount =
        Math.round(
          Number(
            plan.monthlyPrice
          ) * 100
        );


      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid plan amount",
        });

      }


      /*
      =========================
      CREATE RAZORPAY ORDER
      =========================
      */

      console.log("RAZORPAY ORDER DATA:");
console.log("Plan:", plan.name);
console.log("Monthly price:", plan.monthlyPrice);
console.log("Amount in paise:", amount);
console.log(
  "Key ID:",
  process.env.RAZORPAY_KEY_ID
    ? "loaded"
    : "missing"
);

      const order =
        await razorpay.orders.create({
          amount,

          currency:
            "INR",

          receipt:
            `netflix_${Date.now()}`,

          notes: {
            userId:
              user._id.toString(),

            planId:
              plan._id.toString(),
          },
        });


      /*
      =========================
      SAVE PENDING PAYMENT
      =========================
      */

      const payment =
        await Payment.create({

          user:
            user._id,

          plan:
            plan._id,

          planName:
            plan.name,

          paymentMethod:
            "razorpay",

          amount:
            order.amount,

          currency:
            order.currency,

          razorpayOrderId:
            order.id,

          paymentStatus:
            false,

          status:
            "created",

        });


      return res
        .status(200)
        .json({

          success: true,

          key:
            process.env
              .RAZORPAY_KEY_ID,

          orderId:
            order.id,

          amount:
            order.amount,

          currency:
            order.currency,

          paymentRecordId:
            payment._id,

          plan: {
            id:
              plan._id,

            name:
              plan.name,

            price:
              plan.monthlyPrice,
          },

        });


    } catch (error) {

     console.error(
  "Create Razorpay order error:",
  error
);

console.error(
  "Razorpay error details:",
  error?.error ||
  error?.response?.data ||
  error?.description ||
  error?.message
);


      if (
        error.name ===
        "TokenExpiredError"
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              "Signup token expired",

          });

      }


      if (
        error.name ===
        "JsonWebTokenError"
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              "Invalid signup token",

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to create Razorpay order",

          error:
            error.message,

        });

    }

  };


/*
=========================
VERIFY RAZORPAY PAYMENT
=========================
*/

const verifyRazorpayPayment =
  async (req, res) => {

    try {

      const {
        token,

        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body || {};


      if (
        !token ||
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Payment verification details are required",

          });

      }


      /*
      =========================
      VERIFY USER TOKEN
      =========================
      */

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      /*
      =========================
      FIND STORED ORDER
      =========================
      */

      const payment =
  await Payment.findOne({
    razorpayOrderId:
      razorpay_order_id,
  });
  


      if (!payment) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Payment order not found",

          });

      }

      /*
Webhook may have already
marked this payment as paid.
*/

if (
  payment.status === "paid" &&
  payment.paymentStatus === true
) {
  return res.status(200).json({
    success: true,
    message:
      "Payment already verified",

    paymentId:
      payment._id,

    razorpayPaymentId:
      payment.razorpayPaymentId,

    selectedPlan:
      payment.plan,

    planName:
      payment.planName,
  });
}


      /*
      Make sure payment belongs
      to logged-in/signup user.
      */

      if (
        String(payment.user) !==
        String(decoded.userId)
      ) {

        return res
          .status(403)
          .json({

            success: false,

            message:
              "Payment does not belong to this user",

          });

      }


      /*
      =========================
      USE DB ORDER ID
      =========================
      */

      const storedOrderId =
        payment.razorpayOrderId;


      /*
      =========================
      VERIFY SIGNATURE
      =========================
      */

      const signatureBody =
        `${storedOrderId}|${razorpay_payment_id}`;


      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(signatureBody)
          .digest("hex");


      const expectedBuffer =
        Buffer.from(
          expectedSignature,
          "utf8"
        );


      const receivedBuffer =
        Buffer.from(
          razorpay_signature,
          "utf8"
        );


      const isValid =
        expectedBuffer.length ===
          receivedBuffer.length &&

        crypto.timingSafeEqual(
          expectedBuffer,
          receivedBuffer
        );


      if (!isValid) {

        payment.status =
          "failed";

        await payment.save();


        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid payment signature",

          });

      }


      /*
      =========================
      DUPLICATE CHECK
      =========================
      */

      const duplicatePayment =
        await Payment.findOne({

          razorpayPaymentId:
            razorpay_payment_id,

          _id: {
            $ne:
              payment._id,
          },

        });


      if (duplicatePayment) {

        return res
          .status(409)
          .json({

            success: false,

            message:
              "Payment already processed",

          });

      }


      /*
      =========================
      UPDATE PAYMENT
      =========================
      */

      payment.razorpayPaymentId =
        razorpay_payment_id;

      payment.razorpaySignature =
        razorpay_signature;

      payment.paymentStatus =
        true;

      payment.status =
        "paid";


      await payment.save();


      /*
      =========================
      UPDATE USER
      =========================
      */

      const user =
        await User.findById(
          decoded.userId
        );


      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });

      }


      user.paymentCompleted =
        true;

      user.selectedPlan =
        payment.plan;


      await user.save();


      return res
        .status(200)
        .json({

          success: true,

          message:
            "Payment verified successfully",

          paymentId:
            payment._id,

          razorpayPaymentId:
            razorpay_payment_id,

          selectedPlan:
            payment.plan,

          planName:
            payment.planName,

        });


    } catch (error) {

      console.error(
        "Verify Razorpay payment error:",
        error
      );


      if (
        error.name ===
        "TokenExpiredError"
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              "Signup token expired",

          });

      }


      if (
        error.name ===
        "JsonWebTokenError"
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              "Invalid signup token",

          });

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to verify payment",

          error:
            error.message,

        });

    }

  };

  const razorpayWebhook =
  async (req, res) => {

    try {

      const signature =
        req.headers[
          "x-razorpay-signature"
        ];


      if (!signature) {

        return res.status(400).send(
          "Webhook signature missing"
        );

      }


      const rawBody =
        req.body.toString();


      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_WEBHOOK_SECRET
          )
          .update(rawBody)
          .digest("hex");


      const expectedBuffer =
        Buffer.from(
          expectedSignature,
          "utf8"
        );


      const receivedBuffer =
        Buffer.from(
          signature,
          "utf8"
        );


      const isValid =
        expectedBuffer.length ===
          receivedBuffer.length &&

        crypto.timingSafeEqual(
          expectedBuffer,
          receivedBuffer
        );


      if (!isValid) {

        console.log(
          "Invalid Razorpay webhook signature"
        );

        return res.status(400).send(
          "Invalid signature"
        );

      }


      const event =
        JSON.parse(rawBody);


      console.log(
        "RAZORPAY WEBHOOK EVENT:",
        event.event
      );


      /*
      =========================
      PAYMENT CAPTURED / ORDER PAID
      =========================
      */

      if (
        event.event ===
          "payment.captured" ||
        event.event ===
          "order.paid"
      ) {

        const paymentEntity =
          event.payload?.payment
            ?.entity;


        if (paymentEntity) {

          const razorpayOrderId =
            paymentEntity.order_id;


          const razorpayPaymentId =
            paymentEntity.id;


          const payment =
            await Payment.findOne({
              razorpayOrderId,
            });


          if (payment) {

            payment.razorpayPaymentId =
              razorpayPaymentId;

            payment.paymentStatus =
              true;

            payment.status =
              "paid";


            await payment.save();


            await User.findByIdAndUpdate(
              payment.user,
              {
                paymentCompleted:
                  true,

                selectedPlan:
                  payment.plan,
              }
            );


            console.log(
              "Webhook payment marked paid:",
              razorpayPaymentId
            );

          }

        }

      }


      /*
      =========================
      PAYMENT FAILED
      =========================
      */

      if (
        event.event ===
        "payment.failed"
      ) {

        const paymentEntity =
          event.payload?.payment
            ?.entity;


        if (paymentEntity?.order_id) {

          await Payment.findOneAndUpdate(
            {
              razorpayOrderId:
                paymentEntity.order_id,
            },
            {
              status:
                "failed",

              paymentStatus:
                false,
            }
          );

        }

      }


      return res.status(200).json({
        received: true,
      });


    } catch (error) {

      console.error(
        "Razorpay webhook error:",
        error
      );


      return res.status(500).json({
        received: false,
      });

    }

  };

  
module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
};