import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaEnvelope,
  FaKey,
  FaShieldHalved,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";

import "../Styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [otp, setOtp] = useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  function handleEmailNext(event) {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Enter your admin email address."
      );
      return;
    }

    setEmail(normalizedEmail);
    setError("");
    setStep(2);
  }

  async function handleSendOtp(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await POST(
        API_HEADER.ADMIN_FORGOT_PASSWORD,
        {
          email,
          newPassword,
          confirmPassword,
        }
      );

      if (response.success === true) {
        setSuccessMessage(
          response.message ||
            "A 4-digit OTP was sent to your registered email."
        );

        setStep(3);
      }
    } catch (error) {
      console.error(
        "Send reset OTP error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (otp.trim().length !== 4) {
      setError(
        "Enter the 4-digit verification code."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await POST(
        API_HEADER.ADMIN_VERIFY_RESET_OTP,
        {
          email,
          otp: otp.trim(),
        }
      );

      if (response.success === true) {
        navigate("/", {
          replace: true,
          state: {
            resetMessage:
              "Password changed successfully. Sign in with your new password.",
          },
        });
      }
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-background"></div>

      <main className="forgot-password-card">
        <button
          type="button"
          className="forgot-password-back"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          <span>Back to Sign In</span>
        </button>

        <div className="forgot-password-brand">
          <h1>NETFLIX</h1>
          <span>ADMIN</span>
        </div>

        <div className="forgot-password-progress">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={
                step >= item
                  ? "forgot-progress-item active"
                  : "forgot-progress-item"
              }
            >
              <span>{item}</span>

              {item < 3 && <i></i>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <section>
            <div className="forgot-password-icon">
              <FaEnvelope />
            </div>

            <div className="forgot-password-heading">
              <h2>Forgot your password?</h2>

              <p>
                Enter your registered admin email
                address.
              </p>
            </div>

            {error && (
              <p className="forgot-password-error">
                {error}
              </p>
            )}

            <form onSubmit={handleEmailNext}>
              <div className="forgot-password-field">
                <label htmlFor="forgotAdminEmail">
                  Admin email
                </label>

                <div>
                  <FaEnvelope />

                  <input
                    id="forgotAdminEmail"
                    type="email"
                    value={email}
                    placeholder="admin@netflix.com"
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );
                      setError("");
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="forgot-password-primary"
              >
                Continue
              </button>
            </form>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="forgot-password-icon">
              <FaKey />
            </div>

            <div className="forgot-password-heading">
              <h2>Create a new password</h2>

              <p>
                After you continue, a 4-digit OTP
                will be sent to{" "}
                <strong>{email}</strong>.
              </p>
            </div>

            {error && (
              <p className="forgot-password-error">
                {error}
              </p>
            )}

            <form onSubmit={handleSendOtp}>
              <div className="forgot-password-field">
                <label htmlFor="newAdminPassword">
                  New password
                </label>

                <div>
                  <FaKey />

                  <input
                    id="newAdminPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    placeholder="Enter new password"
                    onChange={(event) => {
                      setNewPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                  />

                  <button
                    type="button"
                    className="forgot-password-eye"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showNewPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div className="forgot-password-field">
                <label htmlFor="confirmAdminPassword">
                  Confirm password
                </label>

                <div>
                  <FaKey />

                  <input
                    id="confirmAdminPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                  />

                  <button
                    type="button"
                    className="forgot-password-eye"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="forgot-password-primary"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Send 4-Digit OTP"}
              </button>

              <button
                type="button"
                className="forgot-password-secondary"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                Change Email
              </button>
            </form>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="forgot-password-icon">
              <FaShieldHalved />
            </div>

            <div className="forgot-password-heading">
              <h2>Verify your identity</h2>

              <p>
                Enter the 4-digit OTP sent to{" "}
                <strong>{email}</strong>.
              </p>
            </div>

            {successMessage && (
              <p className="forgot-password-success">
                {successMessage}
              </p>
            )}

            {error && (
              <p className="forgot-password-error">
                {error}
              </p>
            )}

            <form onSubmit={handleVerifyOtp}>
              <div className="forgot-password-field">
                <label htmlFor="adminOtp">
                  Verification code
                </label>

                <div>
                  <FaShieldHalved />

                  <input
                    id="adminOtp"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    placeholder="Enter 4-digit OTP"
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                      setError("");
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="forgot-password-primary"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP & Change Password"}
              </button>

              <button
                type="button"
                className="forgot-password-secondary"
                onClick={() => {
                  setStep(2);
                  setOtp("");
                  setError("");
                }}
              >
                Back to Password
              </button>
            </form>
          </section>
        )}

        <p className="forgot-password-footer">
          Remembered your password?{" "}
          <Link to="/">Sign in</Link>
        </p>
      </main>
    </div>
  );
}

export default ForgotPassword;