import React, { useState } from "react";
import { POST } from "../api/api";
import API_HEADER from "../api/apiHeader";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pngwing.com (4).png";
import "./ProfileSetup.css";

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = location.state?.token || "";
  const planId = location.state?.planId || "";
  const planName = location.state?.planName || "";

  const [mainProfile, setMainProfile] = useState("");
  const [extraProfiles, setExtraProfiles] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [activeInput, setActiveInput] = useState(null);
  const [error, setError] = useState("");

  function handleExtraProfile(index, value) {
    const updatedProfiles = [...extraProfiles];
    updatedProfiles[index] = value;

    setExtraProfiles(updatedProfiles);
    setError("");
  }

 async function handleNext() {
  if (!mainProfile.trim()) {
    setError("Please enter your profile name.");
    return;
  }

  if (!token) {
    setError("Signup token is missing.");
    return;
  }

  const profiles = [
    {
      name: mainProfile.trim(),
      isMainProfile: true,
    },
    ...extraProfiles
      .map((profile) => profile.trim())
      .filter((profile) => profile !== "")
      .map((profile) => ({
        name: profile,
        isMainProfile: false,
      })),
  ];

  console.log("Token:", token);
  console.log("Profiles being sent:", profiles);

  try {
    const response = await POST(
      API_HEADER.SAVE_PROFILES,
      {
        token,
        profiles,
      }
    );

    console.log("Save profiles response:", response);

    if (response.success === true) {
      navigate("/language", {
        state: {
          token,
          planId,
          planName,
        },
      });
    }
  } catch (error) {
    console.error(
      "Save profiles error:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to save profiles."
    );
  }
}

  return (
    <div className="profile-setup-page">
      <header className="profile-setup-header">
        <img
          src={logo}
          alt="Netflix"
          className="profile-setup-logo"
        />

        <button
          type="button"
          className="profile-help-button"
        >
          Help
        </button>
      </header>

      <main className="profile-setup-main">
        <section className="profile-information">
          <p className="profile-step">Step 1 of 4</p>

          <h1>
            Who will be watching
            <br />
            Netflix?
          </h1>

          <ul className="profile-benefits">
            <li>
              You can create up to 5 profiles for your household
            </li>

            <li>
              We only allow people who live with you to use your account
            </li>

            <li>
              Each profile user will get their own recommendations
            </li>
          </ul>
        </section>

        <section className="profile-form-section">
          <h2>Your profile</h2>

          <div
            className={
              activeInput === "main"
                ? "profile-input profile-name-field-active"
                : "profile-input"
            }
          >
            <i className="fa-regular fa-user"></i>

            <div className="input-box">
              <input
                id="mainProfile"
                type="text"
                value={mainProfile}
                placeholder=" "
                maxLength={25}
                onFocus={() => setActiveInput("main")}
                onChange={(event) => {
                  setMainProfile(event.target.value);
                  setError("");
                }}
              />

              <label htmlFor="mainProfile">
                Name
              </label>
            </div>
          </div>

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          <h2 className="add-profile-title">
            Add profiles?
          </h2>

          <div className="extra-profile-list">
            {extraProfiles.map((profile, index) => (
              <div
                key={index}
                className={
                  activeInput === index
                    ? "profile-input profile-name-field-active"
                    : "profile-input"
                }
              >
                <i className="fa-solid fa-user-plus"></i>

                <div className="input-box">
                  <input
                    id={`extra-profile-${index}`}
                    type="text"
                    value={profile}
                    placeholder=" "
                    maxLength={25}
                    onFocus={() => setActiveInput(index)}
                    onChange={(event) =>
                      handleExtraProfile(
                        index,
                        event.target.value
                      )
                    }
                  />

                  <label htmlFor={`extra-profile-${index}`}>
                    Name
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="household-message">
            Only people who live with you may use your account.
          </div>

          <button
            type="button"
            className="profile-next-button"
            onClick={handleNext}
          >
            Next
          </button>
        </section>
      </main>
    </div>
  );
}

export default ProfileSetup;