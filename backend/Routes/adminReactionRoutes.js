const express = require("express");

const {
  getAdminReactions,
  deleteAdminReaction,
} = require(
  "../Controllers/adminReactionController"
);

const adminProtect = require(
  "../Middleware/adminAuthMiddleware"
);  

const router = express.Router();


router.get(
  "/",
  adminProtect,
  getAdminReactions
);

router.delete(
  "/:id",
  adminProtect,
  deleteAdminReaction
);


module.exports = router;