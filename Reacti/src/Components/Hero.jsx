import React, { useState } from 'react'
import "./Hero.css"
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useNavigate } from 'react-router-dom';
function Hero() {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  async function Enter() {
    let newerror = {};

    if (email.trim() === "") {
      newerror.email = "Please enter your email address.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        newerror.email = "Please enter a valid email address.";
      }
    }

    if (Object.keys(newerror).length > 0) {
      setError(newerror);
      return;
    }

    setError({});
    setLoading(true);

  try {
  const data = await POST(
    API_HEADER.START_SIGNUP,
    {
      email: email.trim().toLowerCase(),
    }
  );

  console.log("Start signup response:", data);

  if (data.existingUser === true) {
    navigate("/signin", {
      state: {
        email: data.email,
      },
    });

    return;
  }

  navigate("/newsignin", {
    state: {
      email: data.email,
      userId: data.userId,
    },
  });
} catch (error) {
  console.error(
    "Start signup error:",
    error.response?.data || error.message
  );

  setError({
    email:
      error.response?.data?.message ||
      "Unable to continue. Please try again.",
  });
} finally {
  setLoading(false);
}}

return (
    <section className="hero">
      <h1 className='h'>Unlimited movies, TV shows and more</h1>

      <h3 className='ht'>Starts at ₹149. Cancel anytime.</h3>

      <p>
        Ready to watch? Enter your email to create or restart your membership.
      </p>

      <div className="hero-form">

        <div className="hero-input-row">

          <div className="form-floating">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (error.email) {
                  setError({});
                }
              }}
              className={`form-control ${error.email ? "input-error" : ""
                }`}
              id="floatingInput"
              placeholder="name@example.com"
            />

            <label htmlFor="floatingInput">
              Email address
            </label>
          </div>

          <button
            type="button"
            onClick={Enter}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Sending...
              </>
            ) : (
              "Get Started"
            )}
          </button>

        </div>

        {error.email && (
          <p className="email-error">
            <i className="fa-regular fa-circle-xmark  "></i>
            {error.email}
          </p>
        )}

      </div>

      <p className='mem'>New members only. Terms below.</p>

    </section>
  );
}

export default Hero;
