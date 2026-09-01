import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GET, POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import logo from "../assets/pngwing.com (4).png";
import "./Plan.css";

function Plan() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || "";
  console.log("Plan page token:", token);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await GET(
          API_HEADER.GET_PLANS
        );

        setPlans(response.plans || []);
      } catch (error) {
        console.error(
          "Load plans error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
          "Unable to load plans."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const [selectedPlan, setSelectedPlan] = useState(null);


async function handleNext() {
  if (!selectedPlan) {
    setError("Please select a plan.");
    return;
  }

  if (!token) {
    setError("Signup token is missing.");
    return;
  }

  setError("");

  try {
    const response = await POST(
      API_HEADER.SELECT_PLAN,
      {
        token,
        planId: selectedPlan._id,
      }
    );

    console.log(
      "Select plan response:",
      response
    );

    navigate("/payment", {
      state: {
        token,
        planId: response.plan._id,
        planName: response.plan.name,
      },
    });
  } catch (error) {
    console.error(
      "Select plan error:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to continue to payment."
    );
  }
}

  return (
    <div className="plan-page">
      <header className="plan-header">
        <img src={logo} alt="Netflix" className="plan-logo" />

        <button
          type="button"
          className="plan-signout"
          onClick={() => navigate("/signin")}
        >
          Sign Out
        </button>
      </header>

      <main className="plan-main-content">
        <div className="plan-content">
          <p className="plan-step-text">
            Step <strong>2</strong> of <strong>3</strong>
          </p>

          <h1>Choose any plan to try</h1>

          <div className="free-trial">
            <i className="fa-solid fa-gift"></i>
            <span>Try 14 days for ₹0</span>
          </div>

          <div className="plan-grid">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={
                  selectedPlan?._id === plan._id
                    ? "plan-card selected-plan-card"
                    : "plan-card"
                }
                onClick={() => {
                  setSelectedPlan(plan);
                }}
              >
                {plan.isPopular && (
                  <div className="popular-label">
                    Most Popular
                  </div>
                )}

                <div
                  className={`plan-card-header plan-${plan.name.toLowerCase()}`}
                >
                  <div>
                    <h2>{plan.name}</h2>
                    <p>{plan.resolution}</p>
                  </div>

                  {selectedPlan?._id === plan._id && (
                    <span className="selected-check">
                      <i className="fa-solid fa-circle-check"></i>
                    </span>
                  )}
                </div>

                <div className="plan-card-body">
                  <div className="plan-detail">
                    <span>First 14 days</span>
                    <strong className="free-price">₹0</strong>
                  </div>

                  <div className="plan-detail">
                    <span>Monthly price after trial</span>
                    <strong>₹{plan.monthlyPrice}</strong>
                  </div>

                  <div className="plan-detail">
                    <span>Video and sound quality</span>
                    <strong>{plan.videoQuality}</strong>
                  </div>

                  <div className="plan-detail">
                    <span>Resolution</span>
                    <strong>{plan.resolution}</strong>
                  </div>

                  {plan.name === "Premium" && (
                    <div className="plan-detail">
                      <span>Spatial audio (immersive sound)</span>
                      <strong>Included</strong>
                    </div>
                  )}

                  <div className="plan-detail">
                    <span>Supported devices</span>
                    <strong>{plan.supportedDevices.join(", ")}</strong>
                  </div>

                  <div className="plan-detail">
                    <span>
                      Devices your household can watch at the same time
                    </span>
                    <strong>{plan.simultaneousStreams}</strong>
                  </div>

                  <div className="plan-detail plan-detail-last">
                    <span>Download devices</span>
                    <strong>{plan.downloadDevices}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="plan-notes">
            <p>
              HD (720p), Full HD (1080p), Ultra HD (4K) and HDR
              availability subject to your internet service and device
              capabilities. Not all content is available in all
              resolutions. See our{" "}
              <a href="#">Terms of Use</a> for more details.
            </p>

            <p>
              Only people who live with you may use your account.
              Watch on 4 different devices at the same time with
              Premium, 2 with Standard, and 1 with Basic and Mobile.
            </p>

            <p>
              Live events are included with any Netflix plan and
              contain ads.
            </p>
          </div>

          <button
            type="button"
            className="plan-next-button"
            onClick={handleNext}
          >
            Next
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

export default Plan;