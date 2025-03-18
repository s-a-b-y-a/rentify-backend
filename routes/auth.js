const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/role", protect, (req, res) => {
  if (!req.user || !req.user.role) {
    return res.status(400).json({ message: "User role not found" });
  }

  res.status(201).json({ role: req.user.role }); 
});

module.exports = router;
