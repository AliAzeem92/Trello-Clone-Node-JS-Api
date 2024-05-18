const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Welcome to the Auth
router.get("/", (req, res) => {
  res.json({ message: "Welcome to user auth" });
});

// Register
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const userData = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const user = await userData.save();
    res.status(201).json({ message: "User registered successfuly!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!passwordMatched) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  var token = jwt.sign(
    { id: user._id, admin: false, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });

  return res.status(200).json({ message: "User logged in!", token });
});

module.exports = router;

// Log out
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out!" });
});

// profile
router.get("/profile", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ message: "No Token Provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ message: "User logged in!", user: decoded });
  } catch (error) {
    return res.status(500).json({ message: "User isn't logged in" });
  }
});

// Update profile
router.put("/updateProfile/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
