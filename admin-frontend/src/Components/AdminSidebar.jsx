import React from "react";
import {
    NavLink,
} from "react-router-dom";

import {
    FaChartPie,
    FaFilm,
    FaHeart,
    FaThumbsUp,
    FaUser,
    FaRightFromBracket,
    FaXmark,
} from "react-icons/fa6";


import "../Styles/AdminSidebar.css";

function AdminSidebar({
    sidebarOpen,
    closeSidebar,
    onLogout,
}) {
   

    function handleLogout() {
        removeAdminAuthToken();
        closeSidebar();
        navigate("/", {
            replace: true,
        });
    }

    return (
        <aside
            className={`admin-sidebar ${sidebarOpen
                    ? "admin-sidebar-open"
                    : ""
                }`}
        >
            <div className="admin-sidebar-brand">
                <div>
                    <h1>NETFLIX</h1>
                    <span>ADMIN</span>
                </div>

                <button
                    type="button"
                    className="admin-sidebar-close"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                >
                    <FaXmark />
                </button>
            </div>

            <nav className="admin-sidebar-nav">
                <p className="admin-sidebar-label">
                    Management
                </p>

                <NavLink
                    to="/dashboard"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    <FaChartPie />

                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/movies"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    <FaFilm />

                    <span>Movie Management</span>
                </NavLink>

                <NavLink
                    to="/wishlist"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    <FaHeart />

                    <span>Wishlist Management</span>
                </NavLink>

                <NavLink
                    to="/likes"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    <FaThumbsUp />

                    <span>Like Management</span>
                </NavLink>

                <p className="admin-sidebar-label admin-account-label">
                    Account
                </p>

                <NavLink
                    to="/profile"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    <FaUser />

                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="admin-sidebar-footer">
                <button
                    type="button"
                    className="admin-sidebar-logout"
                    onClick={onLogout}
                >
                    <FaRightFromBracket />
                    <span>Logout</span>
                </button>

                <p>Netflix Admin Panel</p>
            </div>
        </aside>
    );
}

export default AdminSidebar;