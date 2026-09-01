import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import logo from "../assets/pngwing.com (4).png";
import "./Chooseplan.css";

function Chooseplan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenError("Signup token is missing.");
        setChecking(false);
        return;
      }

      try {
        const response = await POST(
          API_HEADER.VERIFY_SIGNUP_TOKEN,
          {
            token,
          }
        );

        console.log(
          "Verified email:",
          response.email
        );

        setVerified(true);
      } catch (error) {
        console.error(
          "Verify signup token error:",
          error.response?.data ||
          error.message
        );

        setTokenError(
          error.response?.data?.message ||
          "Token verification failed."
        );
      } finally {
        setChecking(false);
      }
    }

    verifyToken();
  }, [token]);

  async function handleNext() {
    if (!token) {
      setTokenError("Signup token is missing.");
      return;
    }

    try {
      const response = await POST(
        API_HEADER.CONTINUE_SIGNUP,
        {
          token,
        }
      );

      console.log(
        "Chooseplan response:",
        response
      );

      navigate("/plan", {
        state: {
          token,
        },
      });
    } catch (error) {
      console.error(
        "Continue signup error:",
        error.response?.data ||
        error.message
      );

      setTokenError(
        error.response?.data?.message ||
        "Unable to continue."
      );
    }
  }

  if (checking) {
    return (
      <div className="verify-loading">
        <img
          src={logo}
          alt="Netflix"
          className="setup-logo"
        />

        <div className="spinner"></div>

        <p>Verifying your signup link...</p>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="verify-error">
        <img
          src={logo}
          alt="Netflix"
          className="setup-logo"
        />

        <h2>Unable to continue</h2>

        <p>{tokenError}</p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="choose-plan">
      <header className="setup-header">
        <img
          src={logo}
          alt="Netflix"
          className="setup-logo"
        />

        <button
          type="button"
          className="setup-signin"
          onClick={() => navigate("/signin")}
        >
          Sign Out
        </button>
      </header>

      <main className="plan-main">
        <div className="plan-container">
          <div className="plan-icon">
            <i className="fa-regular fa-circle-check"></i>
          </div>

          <p className="plan-step">
            Step <strong>2</strong> of{" "}
            <strong>3</strong>
          </p>

          <h1>Choose your plan</h1>

          <ul className="plan-list">
            <li>
              No commitments, cancel anytime.
            </li>

            <li>
              Everything on Netflix for one low
              price.
            </li>

            <li>
              No ads, no additional fees. Ever.
            </li>
          </ul>

          {tokenError && (
            <p className="plan-error">
              {tokenError}
            </p>
          )}

          <button
            type="button"
            className="plan-btn"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </main>

      <footer className="plan-footer">
        <div className="plan-footer-container">
          <p>
            Questions? Call 000-800-919-1743
            (Toll-Free)
          </p>

          <div className="plan-footer-links">
            <a href="#">FAQ</a>
            <a href="#">Help Centre</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
            <a href="#">
              Cookie Preferences
            </a>
            <a href="#">
              Corporate Information
            </a>
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

export default Chooseplan;