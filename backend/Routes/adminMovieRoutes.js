const express = require("express");

const {
  addMovie,
  getDashboardStats,
  getMoviesBySection,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../Controllers/adminMovieController");

const adminProtect = require(
  "../Middleware/adminAuthMiddleware"
);

const movieUpload = require("../Middleware/movieUpload");

const router = express.Router();

router.get(
  "/dashboard-stats",
  adminProtect,
  getDashboardStats
);

router.get(
  "/section/:section",
  adminProtect,
  getMoviesBySection
);

router.put(
  "/:id",
  adminProtect,
  updateMovie
);

router.get(
  "/:id",
  adminProtect,
  getMovieById
);

router.delete(
  "/:id",
  adminProtect,
  deleteMovie
);

router.post(
  "/",
  adminProtect,
  movieUpload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
    {
      name: "trailer",
      maxCount: 1,
    },
    {
      name: "banner",
      maxCount: 1,
    },
    {
      name: "titleLogo",
      maxCount: 1,
    },
  ]),
  addMovie
);

module.exports = router;