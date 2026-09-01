import React, { useState } from "react";
import "./Sign.css";
import logo from "../assets/pngwing.com (4).png";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useLocation, useNavigate } from "react-router-dom";

function Signin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mail, setMail] = useState(
    location.state?.email || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  async function Check() {
    if (loading) {
      return;
    }

    const newerror = {};

    if (mail.trim() === "") {
      newerror.mail =
        "Please enter your email or mobile number.";
    } else if (
      !emailPattern.test(mail) &&
      !phonePattern.test(mail)
    ) {
      newerror.mail =
        "Please enter a valid email or mobile number.";
    }

    if (Object.keys(newerror).length > 0) {
      setError(newerror);
      return;
    }

    setError({});
    setLoading(true);
try {
  const response = await POST(
    API_HEADER.SEND_SIGNIN_OTP,
    {
      email: mail.trim().toLowerCase(),
    }
  );

  const data = response;

  console.log("Signin OTP response:", data);

  if (
    data.accountStatus === "new" ||
    data.accountStatus === "incomplete"
  ) {
    navigate("/newsignin", {
      state: {
        email: data.email,
        userId: data.userId,
      },
    });

    return;
  }

  if (data.success === true) {
    navigate("/otp", {
      state: {
        email: data.email,
        signinToken: data.signinToken,
      },
    });
  }
} catch (error) {
  const data = error.response?.data;

  console.error(
    "Signin OTP error:",
    data || error.message
  );

  setError({
    mail:
      data?.message ||
      "Unable to send sign-in code.",
  });
} finally {
  setLoading(false);
}
  }

return (
    <div className="signin-page">
      <img
        className="ne"
        src={logo}
        alt="Netflix"
      />

      <hr className="line" />

      <div className="signin-form">
        <h1>Enter your email to continue</h1>

        <h2>
          We'll send a verification code to your email.
        </h2>

        <div className="form-floatings">
          <input
            type="text"
            value={mail}
            onFocus={() => setError({})}
            onChange={(event) =>
              setMail(event.target.value)
            }
            className="form-control"
            id="signinEmail"
            placeholder=" "
          />

          <label htmlFor="signinEmail">
            Email or mobile number
          </label>
        </div>

        {error.mail && (
          <div className="error">
            <i className="fa-regular fa-circle-xmark"></i>
            <span>{error.mail}</span>
          </div>
        )}

        <button
          type="button"
          onClick={Check}
          className="nbtn"
          disabled={loading}
        >
          {loading
            ? "Sending code..."
            : "Continue"}
        </button>

        <details className="help-box">
          <summary>
            <span>Get Help</span>
            <i className="fa-solid fa-angle-down"></i>
          </summary>

          <div className="help-content">
            <a href="#">
              Forgot email or mobile number
            </a>

            <a href="#">
              Learn more about sign-in
            </a>
          </div>
        </details>

        <p>
          This page is protected by Google reCAPTCHA
          to ensure you're not a bot.
        </p>
      </div>
    </div>
  );
}

export default Signin;