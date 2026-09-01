const express = require("express");
const { getPlans } = require("../Controllers/planController");

const router = express.Router();

router.get("/", getPlans);

module.exports = router;