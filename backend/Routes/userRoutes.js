const express = require("express");
const protect = require("../Middleware/authMiddleware");

const {
  startSignup,
  sendSignupLink,
  verifySignupToken,
  continueSignup,
  selectPlan,
  startWatching,
  saveProfiles,
  saveLanguage,
  saveFavoriteMovies,
  getUserProfile,
  getProfiles,
  completeOnboarding,
  getCurrentProfile,
  savePassword,
  sendSigninOtp,
  verifySigninOtp,
  checkAuth,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/start-signup", startSignup);
router.post("/send-link", sendSignupLink);
router.post("/verify-signup-token", verifySignupToken);
router.post("/continue-signup", continueSignup);
router.post("/select-plan", selectPlan);
router.post("/save-profiles", saveProfiles);
router.post("/save-language", saveLanguage);
router.post("/save-favorite-movies", saveFavoriteMovies);
router.post("/get-user-profile", getUserProfile);
router.post(
  "/get-profiles",
  protect,
  getProfiles
);
router.post(
  "/complete-onboarding",
  protect,
  completeOnboarding
);
router.post(
  "/get-current-profile",
  protect,
  getCurrentProfile
);
router.post("/save-password", savePassword);
router.post("/send-signin-otp", sendSigninOtp);
router.post("/verify-signin-otp", verifySigninOtp);

router.get("/start-watching", startWatching);
router.get(
  "/check-auth",
  protect,
  checkAuth
);

module.exports = router;