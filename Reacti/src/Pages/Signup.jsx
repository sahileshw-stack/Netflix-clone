import React, { useState } from "react";
import logos from "../assets/pngwing.com (4).png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import api from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Signup() {
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submitted = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!name.trim()) {
    newErrors.name = "Full Name is required!";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required!";
  } else if (!email.includes("@")) {
    newErrors.email = "Please enter a valid email";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required!";
  }

  if (!confirmPassword.trim()) {
    newErrors.confirmPassword =
      "Confirm Password is required!";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword =
      "Passwords do not match!";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  const user = {
    name,
    email,
    password,
  };

  try {
    const response = await api.post("/api/signup", user);

    toast.success(
      response.data.message || "Signup successful"
    );

    navigate("/signin", {
      state: {
        email,
      },
    });

  } catch (error) {
    console.log("Signup error:", error);

    toast.error(
      error.response?.data?.message ||
      "Cannot connect to backend"
    );
  }
};

      return (
        <section className="signup-page">
          <img className="logo-side" src={logos} alt="Netflix" />
          <hr className="line" />

          <form className="Signup-form" onSubmit={submitted}>
            <h1>Create Your Account</h1>
            <h2>Join Netflix now</h2>

            <div className="input-box">
              <input
                type="text"
                id="name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="name">Full Name</label>
            </div>
            {errors.name && <p className="errors">{errors.name}</p>}

            <div className="input-box">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            {errors.email && <p className="errors">{errors.email}</p>}

            <div className="input-box">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
            {errors.password && <p className="errors">{errors.password}</p>}

            <div className="input-box">
              <input
                type="password"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            {errors.confirmPassword && (
              <p className="errors">{errors.confirmPassword}</p>
            )}

            <button type="submit" className="Sign-btn">
              Create Account
            </button>

            <p className="back">
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </form>
        </section>
      );
    }

export default Signup;