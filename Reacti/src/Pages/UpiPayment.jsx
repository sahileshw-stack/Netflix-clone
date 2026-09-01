import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";

import gpay from "../assets/gpay.png";
import phonepe from "../assets/phonepe.png";
import paytm from "../assets/paytm.png";
import bhim from "../assets/bhim.png";
import qr from "../assets/qr.png";

import "./UpiPayment.css";

function UpiPayment() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(5 * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => currentTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="upi-payment-page">
      <header className="upi-header">
        <img src={logo} alt="Netflix" className="upi-logo" />

        <button
          type="button"
          className="upi-signout"
          onClick={() => navigate("/signin")}
        >
          Sign Out
        </button>
      </header>

      <main className="upi-main">
        <div className="upi-container">
          <h1>Complete your payment</h1>

          <p className="upi-description">
            Open the preferred UPI app on your mobile device and
            <br />
            scan the QR code.
          </p>

          <div className="upi-qr-card">
            <div className="upi-apps">
              <span>
                <img src={gpay} alt="Google Pay" />
              </span>

              <span>
                <img src={phonepe} alt="PhonePe" />
              </span>

              <span>
                <img src={paytm} alt="Paytm" />
              </span>

              <span>
                <img src={bhim} alt="BHIM" />
              </span>
            </div>

            <img
              src={qr}
              alt="Payment QR code"
              className="payment-qr"
            />

            <p className="unable-text">
              Unable to scan?{" "}
              <button
                type="button"
                onClick={() => navigate("/cardpayment")}
              >
                Pay with card
              </button>
            </p>
          </div>

          {timeLeft > 0 ? (
            <p className="payment-timer">
              Complete payment in{" "}
              <strong>{formattedTime} minutes</strong>
            </p>
          ) : (
            <div className="expired-box">
              <p>Payment session expired.</p>

              <button
                type="button"
                onClick={() => setTimeLeft(5 * 60)}
              >
                Generate new QR
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UpiPayment;