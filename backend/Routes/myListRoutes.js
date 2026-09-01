const express = require("express");

const {
  addToMyList,
  getMyList,
  removeFromMyList,
} = require("../Controllers/myListController");

const protect = require(
  "../Middleware/authMiddleware"
);

const router = express.Router();


router.post(
  "/add",
  protect,
  addToMyList
);

router.get(
  "/",
  protect,
  getMyList
);

router.post(
  "/remove",
  protect,
  removeFromMyList
);


module.exports = router;