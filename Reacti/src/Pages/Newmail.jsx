import React, { useState } from "react";
import mail from "../assets/mail.png";
import logo from "../assets/pngwing.com (4).png";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useLocation, useNavigate } from "react-router-dom";
import "./Newmail.css";

function Newmail() {

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const email = location.state?.email || "your@email.com";
    const token = location.state?.token || "";

async function resendLink() {
    if (!email || email === "your@email.com") {
        setError("Email address is missing.");
        return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
        const response = await POST(
            API_HEADER.SEND_LINK,
            {
                email,
            }
        );

        console.log(
            "Resend link response:",
            response
        );

        if (response.success === true) {
            setMessage(
                "Sign-up link sent again successfully."
            );
        }
    } catch (error) {
        console.error(
            "Resend link error:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Unable to resend link."
        );
    } finally {
        setLoading(false);
    }
}

    return (
        <div className='newmail'>
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
                    <div className="device-img">
                        <img src={mail} alt='mail' />
                    </div>

                    <p className="setup-step">Step 1 of 3</p>

                    <h1>Check your inbox</h1>

                    <p className="setup-description">
                        We sent a sign-up link to <strong>{email}</strong>.
                        Tap the link in the email to finish setting up your account.
                    </p>

                    <button
                        type="button"
                        className="send-link-btn"
                        onClick={resendLink}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Resend Link"}
                    </button>
                    {message && <p className="mail-success">{message}</p>}
                    {error && <p className="mail-error">{error}</p>}

                    <button
                        type="button"
                        className="create-password-btn"
                        onClick={() =>
                            navigate("/password", {
                                state: {
                                    email,
                                    token,
                                },
                            })
                        }
                    >
                        Create Password Instead
                    </button>
                </div>
            </main >
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
        </div >
    )
}

export default Newmail