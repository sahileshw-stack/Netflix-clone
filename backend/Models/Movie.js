const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(


  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    originalTitle: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    releaseYear: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    ageRating: {
      type: String,
      required: true,
      trim: true,
    },

    genres: {
      type: [String],
      default: [],
    },

    director: {
      type: String,
      trim: true,
      default: "",
    },

    creator: {
      type: String,
      trim: true,
      default: "",
    },

    cast: {
      type: [String],
      default: [],
    },

    posterUrl: {
      type: String,
      trim: true,
      default: "",
    },

    bannerUrl: {
      type: String,
      trim: true,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },

    trailerUrl: {
      type: String,
      trim: true,
      default: "",
    },

    movieUrl: {
      type: String,
      trim: true,
      default: "",
    },

    displayOptions: {
      top10: {
        type: Boolean,
        default: false,
      },

      trending: {
        type: Boolean,
        default: false,
      },

      recentlyAdded: {
        type: Boolean,
        default: false,
      },

      recommended: {
        type: Boolean,
        default: false,
      },

      netflixOriginal: {
        type: Boolean,
        default: false,
      },

      featuredBanner: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Published",
        "Archived",
      ],
      default: "Draft",
    },

    publishDate: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    section: {
  type: String,
  enum: [
    "home-hero",
    "recently-added",
    "trending",
    "netflix-original",
    "top-10",
    "worldwide",
  ],
  required: true,
},

    order: {
      type: Number,
      default: 1,
    },

    rank: {
      type: Number,
      default: null,
    },

    titleLogoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }

);

module.exports = mongoose.model(
  "Movie",
  movieSchema
);