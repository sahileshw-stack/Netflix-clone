import React, { useState } from "react";
import { removeAuthToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Movienav.css";
import logo from "../assets/pngwing.com (4).png";
import { Link } from "react-router-dom";
import { FaSearch, FaBell } from "react-icons/fa";

function Navbar({ currentProfile }) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const avatarUrl = currentProfile
    ? `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(
      currentProfile.name
    )}`
    : "";

function handleLogout() {
  removeAuthToken();
  setShowMenu(false);

  navigate("/signin", {
    replace: true,
  });
}

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img
          src={logo}
          alt="Netflix"
          className="logo"
        />

        <ul className="nav-links">
          <li>
            <Link to="/movies">Home</Link>
          </li>

          <li>
            <Link to="/tvshows">TV Shows</Link>
          </li>

          <li>
            <Link to="/movies">Movies</Link>
          </li>

          <li>
            <Link to="/new">New & Popular</Link>
          </li>

          <li>
            <Link
              to="/mylist"
              state={{
                selectedProfile: currentProfile,
              }}
            >
              My List
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <FaSearch className="icon" />
        <FaBell className="icon" />

        <div className="profile-menu">
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setShowMenu((previous) => !previous)}
          >
            {currentProfile && (
              <img
                src={avatarUrl}
                alt={currentProfile.name}
                className="avatar"
              />
            )}

            <span
              className={`profile-arrow ${showMenu ? "open" : ""
                }`}
            >
              <i className="fa-solid fa-caret-down"></i>
            </span>
          </button>

          {showMenu && (
            <div className="profile-dropdown">
              <span className="dropdown-arrow"></span>

              {currentProfile && (
                <div className="dropdown-profile">
                  <img
                    src={avatarUrl}
                    alt={currentProfile.name}
                  />

                  <span>{currentProfile.name}</span>
                </div>
              )}

              <button
                type="button"
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                <i className="fa-solid fa-pencil"></i>
                <span>Manage Profiles</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
              >
                <i className="fa-regular fa-address-card"></i>
                <span>Transfer Profile</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
              >
                <i className="fa-regular fa-user"></i>
                <span>Account</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
              >
                <i className="fa-regular fa-circle-question"></i>
                <span>Help Centre</span>
              </button>

              <div className="dropdown-divider"></div>

              <button
                type="button"
                className="dropdown-signout"
                onClick={handleLogout}
              >
                Sign out of Netflix

                <i
                  className="fa fa-sign-in"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;