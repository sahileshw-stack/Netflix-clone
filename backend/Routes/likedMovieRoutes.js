const express = require("express");

const {
  toggleLike,
  getLikedMovies,
  getRatingStatus,
  saveFirstRating,
} = require("../Controllers/likedMovieController");

const protect = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/toggle", protect, toggleLike);
router.post("/get", protect, getLikedMovies);
router.post("/rating-status", protect, getRatingStatus);
router.post("/save-first-rating", protect, saveFirstRating);

module.exports = router;