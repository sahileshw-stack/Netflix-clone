const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    isMainProfile: {
      type: Boolean,
      default: false,
    },

    feedbackCompleted: {
      type: Boolean,
      default: false,
    },

    feedbackType: {
      type: String,
      enum: ["", "dislike", "like", "love"],
      default: "",
    },
  },
  {
    _id: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    profiles: {
      type: [profileSchema],
      default: [],
    },

    currentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    language: {
      type: [String],
      default: [],
    },

    favoriteMovies: {
      type: [String],
      default: [],
    },

    email: {
      type: String,
      required: true,
    },

    emailHash: {
      type: String,
      default: "",
      index: true,
    },

    password: {
      type: String,
      default: "",
    },

    signinOtpHash: {
      type: String,
      default: "",
    },

    signinOtpExpiresAt: {
      type: Date,
      default: null,
    },

    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },

    paymentCompleted: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    accountCreated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);