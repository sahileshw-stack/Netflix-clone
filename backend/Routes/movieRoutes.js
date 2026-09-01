const express = require("express");

const {
  getPublishedMovies,
} = require("../Controllers/movieController");

const router = express.Router();

router.get(
  "/",
  getPublishedMovies
);

module.exports = router;