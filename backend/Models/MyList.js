const mongoose = require("mongoose");


const myListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    normalizedTitle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);


/*
  Same movie can exist in different profiles,
  but not twice inside the same profile.
*/

myListSchema.index(
  {
    userId: 1,
    profileId: 1,
    normalizedTitle: 1,
  },
  {
    unique: true,
  }
);


module.exports =
  mongoose.model(
    "MyList",
    myListSchema
  );