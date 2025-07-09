const express = require("express");
const router = express.Router();
const {
  getNumbers,
  createNumber,
  getNumbersForAdmin,
} = require("../controllers/numbers");
const authenticate = require("../middleware/auth");
router.get("/", getNumbers);
router.get("/admin", authenticate, getNumbersForAdmin);
router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});
router.post("/", authenticate, createNumber);
module.exports = router;
