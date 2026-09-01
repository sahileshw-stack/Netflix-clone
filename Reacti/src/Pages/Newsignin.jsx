import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import logo from "../assets/pngwing.com (4).png";
import "./Newsignin.css";

function Newsignin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = location.state?.email || "";
  const userId = location.state?.userId || "";

async function sendLink() {
  console.log("Email:", email);

  if (!email) {
    setError("Email address is missing.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await POST(
      API_HEADER.SEND_SIGNUP_LINK,
      {
        email,
        userId,
      }
    );

    console.log("Send link response:", response);

    navigate("/newmail", {
      state: {
        email,
        token: response.token,
      },
    });
  } catch (error) {
    console.error(
      "Send signup link error:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
      "Unable to send signup link."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="setup-page">
      <header className="setup-header">
        <img src={logo} alt="Netflix" className="setup-logo" />

        <button
          type="button"
          className="setup-signin"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </header>

      <main className="setup-main">
        <div className="setup-content">
          <div className="device-icons">
            <i className="fa-solid fa-laptop"></i>
            <i className="fa-solid fa-tv"></i>
            <i className="fa-solid fa-tablet-screen-button"></i>
            <i className="fa-solid fa-mobile-screen-button"></i>
          </div>

          <p className="setup-step">Step 1 of 3</p>

          <h1>Finish setting up your account</h1>

          <p className="setup-description">
            We will send a sign-up link to <strong>{email}</strong> so you can
            use Netflix without a password on any device at any time.
          </p>

          <button
            type="button"
            className="send-link-btn"
            onClick={sendLink}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
          {error && <p className="mail-error">{error}</p>}
        </div>
      </main>

      <footer className="plan-footer">
        <div className="plan-footer-container">
          <p>
            Questions? Call 000-800-919-1743 (Toll-Free)
          </p>

          <div className="plan-footer-links">
            <a href="#">FAQ</a>
            <a href="#">Help Centre</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
            <a href="#">Cookie Preferences</a>
            <a href="#">Corporate Information</a>
          </div>

          <button
            type="button"
            className="language-button"
          >
            <i className="fa-solid fa-language"></i>
            English
            <i className="fa-solid fa-caret-down"></i>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Newsignin;