const express = require("express");
const router = express.Router();
const task = require("../models/task");
const jwt = require("jsonwebtoken");

// Welcome to the task
router.get("/", (req, res) => {
  res.json({ message: "Welcome to user task" });
});

module.exports = router;

// Post
router.post("/addTodo", (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const email = decode.email;
  try {
    const newTask = new task({
      email: email,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
    });
    newTask
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});

module.exports = router;

// Get
router.get("/getTodo", function (req, res) {
  task
    .find({ email: req.body.email })
    .then((data) => {
      if (data.length === 0) {
        res.json({
          data: data,
          message: "No todos found.",
        });
      } else {
        res.json({ data: data, message: "Successfully found Todos" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

module.exports = router;

// Get all tasks
router.get("/getAllTodo", function (req, res) {
  task
    .find()
    .then((data) => {
      if (data.length === 0) {
        res.json({ message: "No todos found." });
      } else {
        res.json({ data: data, message: "Successfully retrieved all todos." });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

module.exports = router;
