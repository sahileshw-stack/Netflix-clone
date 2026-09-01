import React, { useEffect, useState } from "react";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import {
  getAuthToken,
  setAuthToken,
} from "../utils/auth";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

const token =
  location.state?.token ||
  getAuthToken() ||
  "";
  const planId = location.state?.planId || "";
  const planName = location.state?.planName || "";

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingProfileId, setSelectingProfileId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.token) {
  setAuthToken(
    location.state.token
  );
}
    async function loadProfiles() {
      if (!token) {
        setError("Login token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await POST(
          API_HEADER.GET_PROFILES
        );

        setProfiles(response.profiles || []);
      } catch (error) {
        console.error(
          "Load profiles error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
          "Unable to load profiles."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [token]);

  async function selectProfile(profile) {
    if (selectingProfileId) {
      return;
    }

    setSelectingProfileId(profile._id);
    setError("");

    try {
      const response = await POST(
        API_HEADER.COMPLETE_ONBOARDING,
        {
          profileId: profile._id,
        }
      );

      console.log(
        "Complete onboarding response:",
        response
      );

      if (response.success === true) {
        navigate("/movies", {
          state: {
            planId,
            planName,
            selectedProfile: response.profile,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Select profile error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to open this profile."
      );
    } finally {
      setSelectingProfileId("");
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-loading-spinner"></div>
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          src={logo}
          alt="Netflix"
          className="profile-logo"
        />
      </header>

      <main className="profile-main">
        <h1>Who's watching?</h1>

        {error && (
          <p className="profile-page-error">
            {error}
          </p>
        )}

        <div className="profile-list">
          {profiles.map((profile) => {
            const avatar = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(
              profile.name
            )}`;

            const isSelecting =
              selectingProfileId === profile._id;

            return (
              <button
                type="button"
                className="profile-option"
                key={profile._id}
                onClick={() => selectProfile(profile)}
                disabled={Boolean(selectingProfileId)}
              >
                <div className="profile-avatar-wrapper">
                  <img
                    src={avatar}
                    alt={profile.name}
                    className="profile-avatar"
                  />

                  {profile.isMainProfile && (
                    <span className="main-profile-badge">
                      Main
                    </span>
                  )}

                  {isSelecting && (
                    <div className="profile-selecting-overlay">
                      <div className="profile-card-spinner"></div>
                    </div>
                  )}
                </div>

                <p>{profile.name}</p>
              </button>
            );
          })}

          {profiles.length < 5 && (
            <button
              type="button"
              className="profile-option"
            >
              <div className="add-profile-avatar">
                <i className="fa-solid fa-plus"></i>
              </div>

              <p>Add Profile</p>
            </button>
          )}
        </div>

        <button
          type="button"
          className="manage-profile-btn"
        >
          Manage Profiles
        </button>
      </main>
    </div>
  );
}

export default Profile;