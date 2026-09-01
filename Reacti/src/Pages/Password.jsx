import React, { useState } from "react";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import "./Password.css"

function Password() {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";
    const token = location.state?.token || "";

    console.log("Password page token:", token);

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

  async function handleNext() {
  if (loading) {
    return;
  }

  if (password.trim() === "") {
    setError("A password is required");
    return;
  }

  if (password.length < 6) {
    setError(
      "Your password must contain at least 6 characters"
    );
    return;
  }

  if (!token) {
    setError("Signup token is missing");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await POST(
      API_HEADER.SAVE_PASSWORD,
      {
        token,
        password,
      }
    );

    console.log(
      "Save password response:",
      response
    );

    if (response.success === true) {
      navigate("/verifyemail", {
        state: {
          token,
          email,
        },
      });
    }
  } catch (error) {
    console.error(
      "Save password error:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
      "Unable to save password"
    );
  } finally {
    setLoading(false);
  }
}

    return (
        <div className="password-page">
            <header className="password-header">
                <img
                    src={logo}
                    alt="Netflix"
                    className="password-logo"
                />

                <button
                    type="button"
                    className="password-signin"
                    onClick={() => navigate("/signin")}
                >
                    Sign In
                </button>
            </header>

            <main className="password-main">
                <div className="password-container">
                    <p className="password-step">
                        Step <strong>1</strong> of <strong>3</strong>
                    </p>

                    <h1>
                        Create a password to start
                        <br />
                        your membership
                    </h1>

                    <p className="password-description">
                        Just a few more steps and you’re done!
                        <br />
                        We hate paperwork, too.
                    </p>

                    <div className="floating-input">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            readOnly
                            placeholder=" "
                        />

                        <label htmlFor="email">
                            Email
                        </label>
                    </div>

                    <div
                        className={
                            error
                                ? "floating-input floating-error"
                                : "floating-input"
                        }
                    >
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder=" "
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    {error && (
                        <div className="password-error">
                            <i className="fa-regular fa-circle-xmark"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        className="password-next-btn"
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Next"}
                    </button>

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

export default Password;