import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  removeAdminAuthToken,
} from "../Utils/adminAuth";

import { GET, PUT, } from "../api/api";
import API_HEADER from "../api/apiHeader";

import { toast } from "react-toastify";

import {
  FaCamera,
  FaEnvelope,
  FaUser,
  FaShieldHalved,
  FaLock,
  FaFloppyDisk,
  FaCalendarDays,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";

import "../Styles/Profile.css";

function Profile() {

  const navigate = useNavigate();

const [profileData, setProfileData] =
  useState({
    name: "",
    email: "",
    role: "",
    isActive: false,
    createdAt: "",
    profileImage: "",
  });

const [loading, setLoading] =
  useState(true);

const [profileError, setProfileError] =
  useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [
  showCurrentPassword,
  setShowCurrentPassword,
] = useState(false);

const [
  showNewPassword,
  setShowNewPassword,
] = useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);

  const [
  savingProfile,
  setSavingProfile,
] = useState(false);

const [
  uploadingImage,
  setUploadingImage,
] = useState(false);

  useEffect(() => {

  async function loadProfile() {

    try {

      setLoading(true);
      setProfileError("");

      const response = await GET(
        API_HEADER.ADMIN_PROFILE
      );

      if (response.success) {

        setProfileData({
          name:
            response.admin.name || "",

          email:
            response.admin.email || "",

          role:
            response.admin.role || "",

          isActive:
            response.admin.isActive === true,

          createdAt:
            response.admin.createdAt || "",

            profileImage:
  response.admin.profileImage || "",
        });

      }

    } catch (error) {

      console.error(
        "Load admin profile error:",
        error.response?.data ||
        error.message
      );

      setProfileError(
        error.response?.data?.message ||
        "Unable to load admin profile."
      );

    } finally {

      setLoading(false);

    }

  }

  loadProfile();

}, []);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

async function saveProfile(event) {
  event.preventDefault();

  if (savingProfile) {
    return;
  }

  if (!profileData.name.trim()) {
    toast.error(
      "Admin name is required"
    );

    return;
  }

  if (!profileData.email.trim()) {
    toast.error(
      "Admin email is required"
    );

    return;
  }

  try {
    setSavingProfile(true);

    const response = await PUT(
      API_HEADER.ADMIN_PROFILE,
      {
        name:
          profileData.name.trim(),

        email:
          profileData.email
            .trim()
            .toLowerCase(),
      }
    );

    if (response.success) {
      setProfileData(
        (previous) => ({
          ...previous,

          name:
            response.admin.name,

          email:
            response.admin.email,

          role:
            response.admin.role,

          isActive:
            response.admin.isActive,

          createdAt:
            response.admin.createdAt,
        })
      );

      toast.success(
        "Profile updated successfully"
      );
    }

  } catch (error) {
    console.error(
      "Update admin profile error:",
      error.response?.data ||
      error.message
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to update profile"
    );

  } finally {
    setSavingProfile(false);
  }
}

async function updatePassword(event) {
  event.preventDefault();

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = passwordData;

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    toast.error(
      "All password fields are required"
    );

    return;
  }

  if (newPassword.length < 6) {
    toast.error(
      "New password must contain at least 6 characters"
    );

    return;
  }

  if (
    newPassword !== confirmPassword
  ) {
    toast.error(
      "New passwords do not match"
    );

    return;
  }

  try {

    const response = await PUT(
      API_HEADER.ADMIN_CHANGE_PASSWORD,
      {
        currentPassword,
        newPassword,
        confirmPassword,
      }
    );

   if (response.success) {

  toast.success(
    "Password updated successfully. Please sign in again."
  );

  setPasswordData({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  removeAdminAuthToken();

  setTimeout(() => {
    navigate(
      "/",  
      {
        replace: true,
      }
    );
  }, 1200);

}

  } catch (error) {

    console.error(
      "Change admin password error:",
      error.response?.data ||
      error.message
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to change password"
    );

  }
}

  function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

async function handleProfileImageChange(
  event
) {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    toast.error(
      "Only JPG, PNG and WEBP images are allowed"
    );

    return;
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    toast.error(
      "Image must be less than 5MB"
    );

    return;
  }

  try {

    setUploadingImage(true);

    const formData =
      new FormData();

    formData.append(
      "profileImage",
      file
    );

    const response =
      await PUT(
        "/api/admin/auth/profile-image",
        formData
      );

    if (response.success) {

      setProfileData(
        (previous) => ({
          ...previous,

          profileImage:
            response.profileImage,
        })
      );

      toast.success(
        "Profile image updated"
      );
    }

  } catch (error) {

    console.error(
      "Profile image upload error:",
      error.response?.data ||
      error.message
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to upload profile image"
    );

  } finally {

    setUploadingImage(false);

    event.target.value = "";

  }
}

  return (
    <div className="admin-profile-page">
      <section className="admin-profile-heading">
        <div>
          <p className="admin-profile-eyebrow">
            Account Settings
          </p>

          <h1>Admin Profile</h1>

          <p>
            Manage your personal details and account security.
          </p>
        </div>

        <div className="admin-profile-status">
          <FaShieldHalved />

          <div>
            <span>Account Status</span>
            <strong>
  {profileData.isActive
    ? "Active Administrator"
    : "Inactive Administrator"}
</strong>
          </div>
        </div>
      </section>

      <section className="admin-profile-grid">
        <article className="admin-profile-card admin-profile-main-card">
          <div className="admin-profile-cover"></div>

          <div className="admin-profile-avatar-section">
            <div className="admin-profile-large-avatar">

  {profileData.profileImage ? (

    <img
      src={`http://localhost:5000${profileData.profileImage}`}
      alt={profileData.name}
      className="admin-profile-avatar-image"
    />

  ) : (

    <span>
      {profileData.name
        ?.charAt(0)
        ?.toUpperCase() || "A"}
    </span>

  )}


  <label
    className="admin-profile-camera-button"
    title="Change profile picture"
  >

    {uploadingImage
      ? "..."
      : <FaCamera />}

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={
        handleProfileImageChange
      }
      hidden
      disabled={
        uploadingImage
      }
    />

  </label>

</div>

            <div>
              <h2>{profileData.name}</h2>
              <p>{profileData.email}</p>

              <span>
                <FaShieldHalved />
                {profileData.role}
              </span>
            </div>
          </div>

          <div className="admin-profile-account-info">
            <div>
              <FaEnvelope />

              <div>
                <span>Email</span>
                <strong>{profileData.email}</strong>
              </div>
            </div>

            <div>
              <FaUser />

              <div>
                <span>Role</span>
                <strong>{profileData.role}</strong>
              </div>
            </div>

            <div>
  <FaCalendarDays />

  <div>
    <span>Member Since</span>

    <strong>
      {formatDate(
        profileData.createdAt
      )}
    </strong>
  </div>
</div>
          </div>
        </article>

        <div className="admin-profile-settings-column">
          <form
            className="admin-profile-card"
            onSubmit={saveProfile}
          >
            <div className="admin-profile-card-heading">
              <div>
                <FaUser />
              </div>

              <div>
                <h2>Personal Information</h2>

                <p>
                  Update your admin profile details.
                </p>
              </div>
            </div>

            <div className="admin-profile-form-grid">
              <div className="admin-profile-field">
                <label htmlFor="adminProfileName">
                  Full name
                </label>

                <input
                  id="adminProfileName"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminProfileEmail">
                  Email address
                </label>

                <input
                  id="adminProfileEmail"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>


              <div className="admin-profile-field">
                <label htmlFor="adminProfileRole">
                  Role
                </label>

                <input
                  id="adminProfileRole"
                  name="role"
                  type="text"
                  value={profileData.role}
                  readOnly
                />
              </div>
            </div>

            <div className="admin-profile-form-actions">
              <button
  type="submit"
  className="admin-profile-save-button"
  disabled={savingProfile}
>
  <FaFloppyDisk />

  {savingProfile
    ? "Saving..."
    : "Save Changes"}
</button>
            </div>
          </form>

         <form
  className="admin-profile-card"
  onSubmit={updatePassword}
>
  <div className="admin-profile-card-heading">
    <div>
      <FaLock />
    </div>

    <div>
      <h2>Change Password</h2>

      <p>
        Use a strong password for your admin account.
      </p>
    </div>
  </div>


  <div className="admin-profile-form-grid">

    {/* CURRENT PASSWORD */}

    <div className="admin-profile-field full-width">

      <label htmlFor="currentPassword">
        Current password
      </label>

      <div className="admin-profile-password-wrap">

        <input
          id="currentPassword"
          name="currentPassword"
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          value={
            passwordData.currentPassword
          }
          placeholder="Enter current password"
          onChange={handlePasswordChange}
        />

        <button
          type="button"
          className="admin-profile-password-eye"
          onClick={() =>
            setShowCurrentPassword(
              (previous) => !previous
            )
          }
          aria-label={
            showCurrentPassword
              ? "Hide current password"
              : "Show current password"
          }
        >
          {showCurrentPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

    </div>


    {/* NEW PASSWORD */}

    <div className="admin-profile-field">

      <label htmlFor="newPassword">
        New password
      </label>

      <div className="admin-profile-password-wrap">

        <input
          id="newPassword"
          name="newPassword"
          type={
            showNewPassword
              ? "text"
              : "password"
          }
          value={
            passwordData.newPassword
          }
          placeholder="Enter new password"
          onChange={handlePasswordChange}
        />

        <button
          type="button"
          className="admin-profile-password-eye"
          onClick={() =>
            setShowNewPassword(
              (previous) => !previous
            )
          }
          aria-label={
            showNewPassword
              ? "Hide new password"
              : "Show new password"
          }
        >
          {showNewPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

    </div>


    {/* CONFIRM PASSWORD */}

    <div className="admin-profile-field">

      <label htmlFor="confirmPassword">
        Confirm password
      </label>

      <div className="admin-profile-password-wrap">

        <input
          id="confirmPassword"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={
            passwordData.confirmPassword
          }
          placeholder="Confirm new password"
          onChange={handlePasswordChange}
        />

        <button
          type="button"
          className="admin-profile-password-eye"
          onClick={() =>
            setShowConfirmPassword(
              (previous) => !previous
            )
          }
          aria-label={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
        >
          {showConfirmPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

    </div>

  </div>


  <div className="admin-profile-form-actions">

    <button
      type="submit"
      className="admin-profile-password-button"
    >
      <FaLock />
      Update Password
    </button>

  </div>
</form>
        </div>
      </section>
    </div>
  );
}

export default Profile;