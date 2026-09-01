import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { GET } from "../api/api";
import API_HEADER from "../api/apiHeader";

import {
  getAdminAuthToken,
  removeAdminAuthToken,
} from "../Utils/adminAuth";

function PrivateRoute() {
  const location = useLocation();

  const [checking, setChecking] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function verifyAdmin() {
      const token = getAdminAuthToken();

      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const response = await GET(
          API_HEADER.ADMIN_CHECK_AUTH
        );

        setAuthenticated(
          response.authenticated === true
        );
      } catch (error) {
        console.error(
          "Admin authentication error:",
          error.response?.data ||
            error.message
        );

        removeAdminAuthToken();
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }

    verifyAdmin();
  }, []);

  if (checking) {
    return (
      <div className="admin-route-loading">
        <div className="admin-route-spinner"></div>
        <p>Checking admin session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default PrivateRoute;