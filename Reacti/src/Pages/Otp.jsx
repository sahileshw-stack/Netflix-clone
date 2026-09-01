import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { setAuthToken } from "../utils/auth";
import logo from "../assets/pngwing.com (4).png";
import "./Otp.css";

function Otp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const signinToken = location.state?.signinToken || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  function changeEmail() {
    navigate("/signin", {
      state: {
        email: email,
      },
    });
  }

  async function verifyOtp(code) {
    if (loading) {
      return;
    }

    if (!signinToken) {
      setError("Signin session is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await POST(
        API_HEADER.VERIFY_SIGNIN_OTP,
        {
          signinToken,
          otp: code,
        }
      );

      console.log("Verify OTP response:", response);

      if (response.success === true) {
        setAuthToken(response.loginToken);
        navigate("/profile", {
          state: {
            token: response.loginToken,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to verify sign-in code."
      );

      setOtp(["", "", "", ""]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // OTP completed
    if (index === otp.length - 1 && value) {
      const finalOtp = [...newOtp];
      const code = finalOtp.join("");

      if (code.length === 4) {
        console.log("OTP entered:", code);
        verifyOtp(code);
      }
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  }

  return (
    <div className="otp-page">
      <header className="otp-header">
        <img
          src={logo}
          alt="Netflix"
          className="otp-logo"
        />
      </header>

      <main className="otp-container">
        <h1>Enter the code we sent to your email</h1>

        <div className="otp-email-box">
          <span>{email}</span>

          <button
            type="button"
            onClick={changeEmail}
          >
            Change
          </button>
        </div>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              disabled={loading}
              onChange={(e) =>
                handleOtpChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
            />
          ))}
        </div>

        {loading && (
          <p className="otp-loading">
            Verifying code...
          </p>
        )}

        {error && (
          <p className="otp-error">
            <i className="fa-regular fa-circle-xmark"></i>
            <span>{error}</span>
          </p>
        )}

        <p className="expire-text">
          This code will expire in 15 minutes.
        </p>

        <p className="resend-text">
          Didn't get a code?{" "}
          <button type="button">
            Resend code
          </button>
        </p>
      </main>
    </div>
  );
}

export default Otp;