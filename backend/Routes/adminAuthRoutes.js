const express = require("express");

const {
  adminLogin,
  checkAdminAuth,
  requestPasswordReset,
  verifyResetOtp,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateAdminProfileImage,
} = require(
  "../Controllers/adminAuthController"
);

const adminProtect = require(
  "../Middleware/adminAuthMiddleware"
);

const adminProfileUpload = require(
  "../Middleware/adminProfileUpload"
);  


const router = express.Router();

router.post("/login", adminLogin);
router.post(
  "/forgot-password",
  requestPasswordReset
);
router.post(
  "/verify-reset-otp",
  verifyResetOtp
);

router.get(
  "/check-auth",
  adminProtect,
  checkAdminAuth
);
router.get(
  "/profile",
  adminProtect,
  getAdminProfile
);

router.put(
  "/profile",
  adminProtect,
  updateAdminProfile
);

router.put(
  "/change-password",
  adminProtect,
  changeAdminPassword
);

router.put(
  "/profile-image",
  adminProtect,
  adminProfileUpload.single(
    "profileImage"
  ),
  updateAdminProfileImage
);

module.exports = router;