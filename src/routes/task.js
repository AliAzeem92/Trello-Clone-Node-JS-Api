const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const jwt = require("jsonwebtoken");

// Welcome to the task
router.get("/", (req, res) => {
  res.json({ message: "Welcome to user task" });
});

module.exports = router;

// Post
router.post("/addTask", (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const Email = decode.email;
  try {
    const newTask = new Task({
      email: Email,
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

// Get by ID
router.get("/getTask", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const Email = decode.email;
  try {
    const getTask = await Task.find({ email: Email });
    res.status(200).json({ message: "task get  successfully", getTask });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error during finding task", message: error.message });
  }
});

module.exports = router;

// Get all tasks
router.get("/getAllTask", async (req, res) => {
  try {
    const getTasks = await Task.find();
    res.status(200).json({ message: "all task get  successfully", getTasks });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error during finding task", message: error.message });
  }
});

// Put
router.put("/updateTask/:id", async (req, res) => {
  try {
    const update = await Task.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: " updated task successfully", update });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error during updating task", message: error.message });
  }
});

// DELETE
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "deleted task successfully", deleteTask });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error during deleting task", message: error.message });
  }
});

// Search
router.get("/searchTask", async (req, res) => {
  try {
    const query = req.query.search || "Adding Task Update";
    const search = await Task.find({ title: query });
    res.status(200).json({ message: "search task successfully", search });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error during searching task", message: error.message });
  }
});

module.exports = router;
