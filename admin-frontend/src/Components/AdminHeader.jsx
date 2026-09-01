import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaBars,
    FaBell,
    FaMagnifyingGlass,
    FaChevronDown,
    FaUser,
    FaGear,
    FaRightFromBracket,
} from "react-icons/fa6";


import "../Styles/AdminHeader.css";

function AdminHeader({
    onMenuClick,
    onLogout,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] =
        useState(false);

    function getPageTitle() {
        const path = location.pathname;

        if (path === "/dashboard") {
            return "Dashboard";
        }

        if (path === "/movies") {
            return "Movie Management";
        }

        if (path === "/movies/add") {
            return "Add Movie";
        }

        if (path.startsWith("/movies/edit")) {
            return "Edit Movie";
        }

        if (path === "/wishlist") {
            return "Wishlist Management";
        }

        if (path === "/likes") {
            return "Like Management";
        }

        if (path === "/profile") {
            return "Profile";
        }

        return "Admin Panel";
    }

    function handleLogout() {
        removeAdminAuthToken();

        navigate("/", {
            replace: true,
        });
    }

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <button
                    type="button"
                    className="admin-header-menu"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                >
                    <FaBars />
                </button>

                <div>
                    <h2>{getPageTitle()}</h2>

                    <p>
                        Welcome back, Netflix Admin
                    </p>
                </div>
            </div>

            <div className="admin-header-right">
                <div className="admin-header-search">
                    <FaMagnifyingGlass />

                    <input
                        type="text"
                        placeholder="Search..."
                    />
                </div>

                <button
                    type="button"
                    className="admin-header-icon-button"
                    aria-label="Notifications"
                >
                    <FaBell />

                    <span className="admin-notification-dot"></span>
                </button>

                <div className="admin-header-profile">
                    <button
                        type="button"
                        className="admin-profile-trigger"
                        onClick={() =>
                            setProfileOpen(
                                (previous) => !previous
                            )
                        }
                    >
                        <div className="admin-profile-avatar">
                            A
                        </div>

                        <div className="admin-profile-details">
                            <strong>Netflix Admin</strong>
                            <span>Administrator</span>
                        </div>

                        <FaChevronDown
                            className={
                                profileOpen
                                    ? "admin-profile-arrow-open"
                                    : ""
                            }
                        />
                    </button>

                    {profileOpen && (
                        <div className="admin-profile-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(false);
                                    navigate("/profile");
                                }}
                            >
                                <FaUser />
                                <span>My Profile</span>
                            </button>

                            <button type="button">
                                <FaGear />
                                <span>Settings</span>
                            </button>

                            <div className="admin-profile-divider"></div>

                            <button
                                type="button"
                                className="admin-profile-logout"
                                onClick={() => {
                                    setProfileOpen(false);
                                    onLogout();
                                }}
                            >
                                <FaRightFromBracket />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;