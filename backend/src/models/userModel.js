const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      immutable: true,
      unique: true,
      trim: true,
      validate: {
        message: "{VALUE} is not a valid Email",
        validator: (info) => {
          return validator.isEmail(info);
        },
      },
    },

    role: {
      type: String,
      enum: {
        values: ["owner", "admin", "employee"],
        message: "{VALUE} is not a valid role",
      },

      required: true,
    },

    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Org",
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
