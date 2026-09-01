const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    monthlyPrice: {
      type: Number,
      required: true,
    },

    videoQuality: {
      type: String,
      required: true,
    },

    resolution: {
      type: String,
      required: true,
    },

    supportedDevices: {
      type: [String],
      default: [],
    },

    simultaneousStreams: {
      type: Number,
      required: true,
    },

    downloadDevices: {
      type: Number,
      required: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", planSchema);