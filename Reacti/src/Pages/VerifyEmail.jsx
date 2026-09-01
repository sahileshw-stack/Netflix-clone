import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import "./VerifyEmail.css";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email =
    location.state?.email ||
    localStorage.getItem("signupEmail") ||
    "your@email.com";

  function handleSkip() {
    navigate("/plan");
  }

  return (
    <div className="verify-email-page">
      <header className="verify-header">
        <img
          src={logo}
          alt="Netflix"
          className="verify-logo"
        />

        <button
          type="button"
          className="verify-signout"
          onClick={() => navigate("/signin")}
        >
          Sign Out
        </button>
      </header>

      <main className="verify-main">
        <div className="verify-container">
          <div className="verify-icon">
            <i className="fa-regular fa-circle-check"></i>
          </div>

          <p className="verify-step">
            Step <strong>2</strong> of <strong>4</strong>
          </p>

          <h1>
            Great, now let us verify your
            email
          </h1>

          <p className="verify-description">
            Click the link we sent to{" "}
            <strong>{email}</strong> to verify.
          </p>

          <p className="verify-description verify-second-text">
            Verifying your email will improve account security and
            help you receive important Netflix communications.
          </p>

          <button
            type="button"
            className="verify-skip-btn"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </main>

      <footer className="verify-footer">
        <div className="verify-footer-inner">
          <p>
            Questions? Call 000-800-919-1743 (Toll-Free)
          </p>

          <div className="verify-footer-links">
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

export default VerifyEmail;