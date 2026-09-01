const express = require("express");

const {
  getUserStats,
} = require(
  "../Controllers/adminUserController"
);

const adminProtect = require(
  "../Middleware/adminAuthMiddleware"
);

const router = express.Router();

router.get(
  "/stats",
  adminProtect,
  getUserStats
);

module.exports = router;