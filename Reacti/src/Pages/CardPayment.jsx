import React, {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
  getAuthToken,
} from "../utils/auth";

import logo from "../assets/pngwing.com (4).png";

import "./CardPayment.css";


function CardPayment() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /*
  =========================
  SELECTED PLAN FALLBACK
  =========================
  */

  let storedPlan = null;

  try {

    storedPlan =
      JSON.parse(
        localStorage.getItem(
          "selectedPlan"
        ) || "null"
      );

  } catch (error) {

    console.error(
      "Selected plan parse error:",
      error
    );

  }


  /*
  =========================
  TOKEN / PLAN
  =========================
  */

  const token =
    location.state?.token ||
    getAuthToken() ||
    "";


  const planId =
    location.state?.planId ||
    storedPlan?._id ||
    storedPlan?.id ||
    "";


  const planName =
    location.state?.planName ||
    storedPlan?.name ||
    "Selected Plan";


  const email =
    location.state?.email ||
    localStorage.getItem(
      "signupEmail"
    ) ||
    "";


  console.log(
    "Card token:",
    token
  );

  console.log(
    "Card plan ID:",
    planId
  );

  console.log(
    "Card plan name:",
    planName
  );


  /*
  =========================
  STATE
  =========================
  */

  const [
    agree,
    setAgree,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    errors,
    setErrors,
  ] = useState({});


  /*
  =========================
  LOAD RAZORPAY SCRIPT
  =========================
  */

  function loadRazorpayScript() {

    return new Promise(
      (resolve) => {

        /*
        Already loaded
        */

        if (window.Razorpay) {

          resolve(true);

          return;

        }


        /*
        Create script
        */

        const script =
          document.createElement(
            "script"
          );


        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";


        script.async = true;


        script.onload = () => {

          resolve(true);

        };


        script.onerror = () => {

          resolve(false);

        };


        document.body.appendChild(
          script
        );

      }
    );

  }


  /*
  =========================
  START MEMBERSHIP
  =========================
  */

  async function handleMembership() {

    if (loading) {
      return;
    }


    /*
    =========================
    AGREEMENT
    =========================
    */

    if (!agree) {

      setErrors({
        agree:
          "You must agree before starting your membership.",
      });

      return;

    }


    /*
    =========================
    TOKEN / PLAN CHECK
    =========================
    */

    if (!token || !planId) {

      setErrors({
        payment:
          "Signup token or plan is missing.",
      });

      return;

    }


    try {

      setLoading(true);


      setErrors({});


      /*
      =========================
      LOAD RAZORPAY
      =========================
      */

      const scriptLoaded =
        await loadRazorpayScript();


      if (!scriptLoaded) {

        throw new Error(
          "Unable to load Razorpay Checkout."
        );

      }


      /*
      =========================
      CREATE ORDER
      =========================
      */

      console.log(
        "RAZORPAY CREATE URL:",
        API_HEADER
          .RAZORPAY_CREATE_ORDER
      );

      console.log(
  "FULL API HEADER:",
  API_HEADER
);

console.log(
  "CREATE ORDER URL:",
  API_HEADER.RAZORPAY_CREATE_ORDER
);

      const orderResponse =
        await POST(
          API_HEADER
            .RAZORPAY_CREATE_ORDER,
          {
            token,
            planId,
          }
        );


      console.log(
        "Razorpay order response:",
        orderResponse
      );


      if (
        orderResponse.success !==
          true ||
        !orderResponse.orderId
      ) {

        throw new Error(
          "Unable to create payment order."
        );

      }


      /*
      =========================
      RAZORPAY OPTIONS
      =========================
      */

      const options = {

        key:
          orderResponse.key,


        amount:
          orderResponse.amount,


        currency:
          orderResponse.currency ||
          "INR",


        name:
          "Netflix Clone",


        description:
          `${
            orderResponse.plan?.name ||
            planName
          } Membership`,


        order_id:
          orderResponse.orderId,


        /*
        =========================
        PREFILL
        =========================
        */

        prefill: {

          email:
            email,

        },


        /*
        =========================
        PAYMENT SUCCESS
        =========================
        */

        handler:
          async function (
            razorpayResponse
          ) {

            try {

              console.log(
                "Razorpay success:",
                razorpayResponse
              );


              /*
              =========================
              VERIFY PAYMENT
              =========================
              */

              const verifyResponse =
                await POST(
                  API_HEADER
                    .RAZORPAY_VERIFY,
                  {
                    token,

                    razorpay_payment_id:
                      razorpayResponse
                        .razorpay_payment_id,

                    razorpay_order_id:
                      razorpayResponse
                        .razorpay_order_id,

                    razorpay_signature:
                      razorpayResponse
                        .razorpay_signature,
                  }
                );


              console.log(
                "Razorpay verification:",
                verifyResponse
              );


              /*
              =========================
              SUCCESS
              =========================
              */

              if (
                verifyResponse.success ===
                true
              ) {

                navigate(
                  "/profilesetup",
                  {
                    state: {

                      token,

                      planId:
                        verifyResponse
                          .selectedPlan ||
                        planId,

                      planName:
                        verifyResponse
                          .planName ||
                        planName,

                    },

                    replace: true,
                  }
                );

                return;

              }


              setErrors({
                payment:
                  "Payment verification failed.",
              });


            } catch (error) {

              console.error(
                "Verify Razorpay payment error:",
                error.response?.data ||
                error.message
              );


              setErrors({
                payment:
                  error.response?.data
                    ?.message ||
                  "Payment verification failed.",
              });


            } finally {

              setLoading(false);

            }

          },


        /*
        =========================
        THEME
        =========================
        */

        theme: {

          color:
            "#e50914",

        },


        /*
        =========================
        POPUP CLOSED
        =========================
        */

        modal: {

          ondismiss:
            function () {

              console.log(
                "Razorpay checkout closed"
              );

              setLoading(false);

            },

        },

      };


      /*
      =========================
      CREATE CHECKOUT
      =========================
      */

      const razorpayCheckout =
        new window.Razorpay(
          options
        );


      /*
      =========================
      PAYMENT FAILED
      =========================
      */

      razorpayCheckout.on(
        "payment.failed",
        function (response) {

          console.error(
            "Razorpay payment failed:",
            response.error
          );


          setErrors({
            payment:
              response.error
                ?.description ||
              "Payment failed. Please try again.",
          });


          setLoading(false);

        }
      );


      /*
      =========================
      OPEN RAZORPAY
      =========================
      */

      razorpayCheckout.open();


    } catch (error) {

      console.error(
        "Create Razorpay payment error:",
        error.response?.data ||
        error.message
      );


      setErrors({
        payment:
          error.response?.data
            ?.message ||
          error.message ||
          "Unable to start payment.",
      });


      setLoading(false);

    }

  }


  /*
  =========================
  PAGE
  =========================
  */

  return (

    <div className="card-payment-page">


      {/* HEADER */}

      <header className="card-header">

        <img
          src={logo}
          alt="Netflix"
          className="card-logo"
        />


        <button
          type="button"
          className="card-signout"
          onClick={() =>
            navigate(
              "/signin"
            )
          }
        >
          Sign Out
        </button>

      </header>


      {/* CONTENT */}

      <main className="card-main">

        <div className="card-container">


          {/* INFO */}

          <div className="temporary-charge">

            <i className="fa-solid fa-circle-info"></i>

            <p>
              Your payment details will be
              securely processed by Razorpay.
            </p>

          </div>


          {/* BACK */}

          <button
            type="button"
            className="change-payment"
            onClick={() =>
              navigate(
                "/payment",
                {
                  state: {
                    token,
                    planId,
                    planName,
                  },
                }
              )
            }
          >

            <i className="fa-solid fa-chevron-left"></i>

            Change payment method

          </button>


          {/* STEP */}

          <p className="card-step">

            Step{" "}
            <strong>
              4
            </strong>{" "}
            of{" "}
            <strong>
              4
            </strong>

          </p>


          {/* HEADING */}

          <h1>
            Set up your credit or debit card
          </h1>


          {/* CARD BRANDS */}

          <div className="card-brands">

            <span className="card-visa">
              VISA
            </span>


            <span className="card-mastercard">

              <span></span>

              <span></span>

            </span>

          </div>


          {/* SECURE PAYMENT BOX */}

          <div className="razorpay-secure-box">

            <div className="razorpay-secure-icon">

              <i className="fa-solid fa-lock"></i>

            </div>


            <div>

              <h3>
                Secure card payment
              </h3>

              <p>
                After clicking Start Membership,
                Razorpay Checkout will open.
                Enter your card number, expiry date
                and CVV securely inside Razorpay.
              </p>

            </div>

          </div>


          {/* SELECTED PLAN */}

          <div className="chosen-plan-box">

            <div>

              <span className="welcome-offer">
                Welcome Offer
              </span>


              <h3>
                {planName}
              </h3>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/plan"
                )
              }
            >
              Change
            </button>

          </div>


          {/* NOTE */}

          <p className="payment-note">
            Your card information is handled
            securely by Razorpay and is not
            stored by this application.
          </p>


          {/* TERMS */}

          <p className="payment-terms">

            You agree to our{" "}

            <a href="#">
              Terms of Use
            </a>

            ,{" "}

            <a href="#">
              Privacy Statement
            </a>

            {" "}and that you are over 18.

            Netflix will automatically continue
            your membership until you cancel.

          </p>


          {/* AGREEMENT */}

          <label
            className={
              errors.agree
                ? "agree-row agree-row-error"
                : "agree-row"
            }
          >

            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => {

                setAgree(
                  event.target.checked
                );


                setErrors(
                  (previous) => ({
                    ...previous,

                    agree: "",
                  })
                );

              }}
            />


            <span>
              I agree.
            </span>

          </label>


          {/* AGREE ERROR */}

          {errors.agree && (

            <p className="field-error-message">

              <i className="fa-regular fa-circle-xmark"></i>

              {errors.agree}

            </p>

          )}


          {/* PAYMENT ERROR */}

          {errors.payment && (

            <p className="field-error-message">

              <i className="fa-regular fa-circle-xmark"></i>

              {errors.payment}

            </p>

          )}


          {/* START MEMBERSHIP */}

          <button
            type="button"
            className="start-membership-btn"
            onClick={
              handleMembership
            }
            disabled={
              loading
            }
          >

            {loading ? (

              <>

                <span className="membership-spinner"></span>

                Opening secure payment...

              </>

            ) : (

              "Start Membership"

            )}

          </button>


          <p className="recaptcha-text">
            This page is protected by
            Google reCAPTCHA to ensure
            you're not a bot.
          </p>


        </div>

      </main>

    </div>

  );

}


export default CardPayment;