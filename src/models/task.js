const mongoose = require("mongoose");

const usertaskSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    dueDate: { type: String },
    priority: { type: String },
  },

  { collection: "task", versionKey: false }
);

const Task = mongoose.model("task", usertaskSchema);

module.exports = Task;
