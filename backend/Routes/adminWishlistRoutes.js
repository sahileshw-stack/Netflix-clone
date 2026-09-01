const express = require("express");

const {
  getAdminWishlist,
  deleteWishlistItem,
} = require(
  "../Controllers/adminWishlistController"
);

const adminProtect = require(
  "../Middleware/adminAuthMiddleware"
);

const router = express.Router();


router.get(
  "/",
  adminProtect,
  getAdminWishlist
);

router.delete(
  "/:id",
  adminProtect,
  deleteWishlistItem
);


module.exports = router;