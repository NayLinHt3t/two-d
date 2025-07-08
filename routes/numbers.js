const express = require("express");
const router = express.Router();
const { getNumbers, createNumber } = require("../controllers/numbers");
const authenticate = require("../middleware/auth");
router.get("/", getNumbers);
router.post("/", authenticate, createNumber);
module.exports = router;
