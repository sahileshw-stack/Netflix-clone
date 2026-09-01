import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { GET } from "../api/api";
import API_HEADER from "../api/apiHeader";
import {
  getAuthToken,
  removeAuthToken,
} from "../utils/auth";
import "./PrivateRoute.css";

function PrivateRoute({ children }) {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function verifyAuthentication() {
      const token = getAuthToken();

      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const response = await GET(
          API_HEADER.CHECK_AUTH
        );

        setAuthenticated(
          response.authenticated === true
        );
      } catch (error) {
        console.error(
          "Authentication check error:",
          error.response?.data || error.message
        );

        removeAuthToken();
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }

    verifyAuthentication();
  }, []);

  if (checking) {
    return (
      <div className="private-route-loading">
        <div className="private-route-spinner"></div>
        <p>Checking your session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/signin"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return children;
}

export default PrivateRoute;