import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { setAdminAuthToken } from "../Utils/adminAuth";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";

import "../Styles/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState({});

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleLogin(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const newError = {};

    if (!email.trim()) {
      newError.email =
        "Admin email is required.";
    } else if (
      !emailPattern.test(email.trim())
    ) {
      newError.email =
        "Enter a valid email address.";
    }

    if (!password) {
      newError.password =
        "Password is required.";
    }

    if (
      Object.keys(newError).length > 0
    ) {
      setError(newError);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await POST(
        API_HEADER.ADMIN_LOGIN,
        {
          email:
            email.trim().toLowerCase(),
          password,
          rememberMe,
        }
      );

      if (
        response.success === true &&
        response.token
      ) {
        setAdminAuthToken(
          response.token
        );

        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Admin login error:",
        error.response?.data ||
          error.message
      );

      setError({
        form:
          error.response?.data?.message ||
          "Unable to sign in.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-overlay"></div>

      <main className="admin-login-card">
        <div className="admin-login-brand">
          <h1>NETFLIX</h1>
          <span>ADMIN</span>
        </div>

        <div className="admin-login-heading">
          <h2>Admin Sign In</h2>

          <p>
            Welcome back Admin 👋
          </p>
        </div>

        {error.form && (
          <div className="admin-login-form-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error.form}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="admin-login-field">
            <label htmlFor="adminEmail">
              Email
            </label>

            <div
              className={`admin-login-input ${
                error.email
                  ? "admin-login-input-error"
                  : ""
              }`}
            >
              <i className="fa-regular fa-envelope"></i>

              <input
                id="adminEmail"
                type="email"
                value={email}
                placeholder="admin@example.com"
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setError((previous) => ({
                    ...previous,
                    email: "",
                    form: "",
                  }));
                }}
              />
            </div>

            {error.email && (
              <p className="admin-field-error">
                {error.email}
              </p>
            )}
          </div>

          <div className="admin-login-field">
            <label htmlFor="adminPassword">
              Password
            </label>

            <div
              className={`admin-login-input ${
                error.password
                  ? "admin-login-input-error"
                  : ""
              }`}
            >
              <i className="fa-solid fa-lock"></i>

              <input
                id="adminPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Enter password"
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError((previous) => ({
                    ...previous,
                    password: "",
                    form: "",
                  }));
                }}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
  <FaEyeSlash />
) : (
  <FaEye />
)}
              </button>
            </div>

            {error.password && (
              <p className="admin-field-error">
                {error.password}
              </p>
            )}
          </div>

          <div className="admin-login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span>Remember me</span>
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-login-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized administrators only
        </p>
      </main>
    </div>
  );
}

export default AdminLogin;