import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import gpay from "../assets/gpay.png";
import phonepe from "../assets/phonepe.png";
import paytm from "../assets/paytm.png";
import bhim from "../assets/bhim.png";
import { getAuthToken } from "../Utils/auth";
import "./Payment.css";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const token =
  location.state?.token ||
  getAuthToken() ||
  "";
    const selectedPlan =
  location.state?.plan ||
  JSON.parse(
    localStorage.getItem(
      "selectedPlan"
    ) || "null"
  );

const planId =
  location.state?.planId ||
  selectedPlan?._id ||
  selectedPlan?.id ||
  "";

const planName =
  location.state?.planName ||
  selectedPlan?.name ||
  "";

const email =
  location.state?.email ||
  localStorage.getItem(
    "signupEmail"
  ) ||
  "";

    function chooseCard() {
        navigate("/cardpayment", {
            state: {
                token,
                planId,
                planName,
            },
        });
    }

    function chooseUpi() {
        navigate("/upi", {
            state: {
                token,
                planId,
                planName,
            },
        });
    }

    return (
        <div className="payment-page">
            <header className="payment-header">
                <img src={logo} alt="Netflix" className="payment-logo" />

                <button
                    type="button"
                    className="payment-signout"
                    onClick={() => navigate("/signin")}
                >
                    Sign Out
                </button>
            </header>

            <main className="payment-main">
                <div className="payment-container">
                    <div className="payment-lock-icon">
                        <i className="fa-solid fa-lock"></i>
                    </div>

                    <h1>
                        Change your payment
                        <br />
                        method
                    </h1>

                    <p className="payment-description">
                        It will be applied to your next billing cycle.
                    </p>

                    <p className="encrypted-text">
                        End-to-end encrypted
                        <i className="fa-solid fa-lock"></i>
                    </p>

                    <button
                        type="button"
                        className="payment-option"
                        onClick={chooseCard}
                    >
                        <div className="payment-option-left">
                            <span>Credit or Debit Card</span>

                            <div className="payment-logos">
                                <span className="visa-logo">VISA</span>
                                <span className="mastercard-logo">
                                    <span></span>
                                    <span></span>
                                </span>
                            </div>
                        </div>

                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    <button
                        type="button"
                        className="payment-option"
                        onClick={chooseUpi}
                    >
                        <div className="payment-option-left">
                            <span>UPI AutoPay</span>

                            <div className="payment-logos">
                                <span className="upi-brand">
                                    <img src={gpay} alt="Google Pay" />
                                </span>

                                <span className="upi-brand">
                                    <img src={phonepe} alt="PhonePe" />
                                </span>

                                <span className="upi-brand">
                                    <img src={paytm} alt="Paytm" />
                                </span>

                                <span className="upi-brand">
                                    <img src={bhim} alt="BHIM" />
                                </span>
                            </div>
                        </div>

                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    <button
                        type="button"
                        className="promo-link"
                    >
                        Redeem Gift or Promo Code
                    </button>
                </div>
            </main>

            <footer className="payment-footer">
                <div className="payment-footer-inner">
                    <p>
                        Questions? Call 000-800-919-1743 (Toll-Free)
                    </p>

                    <div className="payment-footer-links">
                        <a href="#">FAQ</a>
                        <a href="#">Help Centre</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Privacy</a>
                        <a href="#">Cookie Preferences</a>
                        <a href="#">Corporate Information</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Payment;