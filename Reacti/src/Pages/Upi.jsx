import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import "./Upi.css"

function Upi() {
    const navigate = useNavigate();
    const location = useLocation();
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState({ agree: "" });

    const selectedPlan =
        location.state?.selectedPlan || { name: "Standard", price: "₹199" };

        function handleMembership() {
  if (!agree) {
    setErrors({
      agree: "You must agree before starting your membership.",
    });

    return;
  }

  setErrors({ agree: "" });

  navigate("/upipayment", {
    state: {
      selectedPlan,
    },
  });
}

    return (
        <div className="card-payment-page">
            <header className="card-header">
                <img src={logo} alt="Netflix" className="card-logo" />

                <button
                    type="button"
                    className="card-signout"
                    onClick={() => navigate("/signin")}
                >
                    Sign Out
                </button>
            </header>
            <main className="card-main">
                <div className="card-container">
                    <div className="temporary-charge">
                        <i className="fa-solid fa-circle-info"></i>

                        <p>
                            To set up your payment, you will be temporarily charged ₹2.
                            Any temporary charges will be refunded.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="change-payment"
                        onClick={() => navigate("/payment")}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                        Change payment method
                    </button>
                    <p className="card-step">
                        Step <strong>4</strong> of <strong>4</strong>
                    </p>
                    <h1>Set up your UPI Autopay</h1>

                    <div className="chosen-plan-box">
                        <div>
                            <span className="welcome-offer">Welcome Offer</span>
                            <h3>{selectedPlan.name}</h3>
                            <p className="offer-price">₹0 first 7 days</p>
                            <p>then {selectedPlan.price}/month</p>
                        </div>

                        <button type="button" onClick={() => navigate("/plan")}>Change</button>
                    </div>
                    <p className="payment-terms">
                        You agree to our <a href="#">Terms of Use</a>, <a href="#">Privacy Statement</a> and that you are over 18.
                        Netflix will automatically continue your membership until you cancel.
                    </p>
                    <label
                        className={
                            errors.agree
                                ? "agree-row agree-row-error"
                                : "agree-row"
                        }
                    >
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(event) => {
                                setAgree(event.target.checked);

                                setErrors((previous) => ({
                                    ...previous,
                                    agree: "",
                                }));
                            }}
                        />

                        <span>I agree.</span>
                    </label>

                    {errors.agree && (
                        <p className="agree-error-message">
                            <i className="fa-regular fa-circle-xmark"></i>
                            <span>{errors.agree}</span>
                        </p>
                    )}

                    <button
                        type="button"
                        className="start-membership-btn"
                        onClick={handleMembership}
                    >
                        Start Membership
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Upi