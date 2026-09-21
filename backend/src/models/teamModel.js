const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

teamSchema.index({ adminId: 1, organisationId: 1, name: 1 }, { unique: true });

const teamModel = mongoose.model("Team", teamSchema);

module.exports = teamModel;
