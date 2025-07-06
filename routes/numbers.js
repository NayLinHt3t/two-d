const express = require("express");
const router = express.Router();
const {
  getNumbers,
  createNumber,
  updateNumber,
} = require("../controllers/numbers");
const authenticate = require("../middleware/auth");
router.get("/", getNumbers);
router.post("/", authenticate, createNumber);
router.put("/:id", authenticate, updateNumber);
module.exports = router;
