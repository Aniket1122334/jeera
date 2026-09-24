const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      lowercase: true,
      enum: {
        values: ["todo", "in-progress", "completed"],
        message: "{VALUE} is not a valid task status",
      },
      default: "todo",
    },

    priority: {
      type: String,
      lowercase: true,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },

    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
