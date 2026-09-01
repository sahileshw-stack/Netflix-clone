import React, { useState } from "react";
import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import AdminSidebar from "../Components/AdminSidebar";
import AdminHeader from "../Components/AdminHeader";
import LogoutModal from "../Components/LogoutModal";

import { removeAdminAuthToken } from "../Utils/adminAuth";

import "../Styles/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [logoutOpen, setLogoutOpen] =
    useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function openLogoutModal() {
    closeSidebar();
    setLogoutOpen(true);
  }

  function confirmLogout() {
    removeAdminAuthToken();
    setLogoutOpen(false);

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        onLogout={openLogoutModal}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        ></button>
      )}

      <div className="admin-layout-main">
        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
          onLogout={openLogoutModal}
        />

        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>

      <LogoutModal
        open={logoutOpen}
        onClose={() =>
          setLogoutOpen(false)
        }
        onConfirm={confirmLogout}
      />
    </div>
  );
}

export default AdminLayout;